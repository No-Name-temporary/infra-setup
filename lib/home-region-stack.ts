import 'dotenv/config';
import cdk = require('aws-cdk-lib');
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as iam from 'aws-cdk-lib/aws-iam';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Duration } from 'aws-cdk-lib';
import { SqsSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { ITopic } from 'aws-cdk-lib/aws-sns';
import { ServerApp } from './server-construct';


interface HomeStackProps extends cdk.StackProps {
  pgInstance: rds.DatabaseInstance
}

export class HomeRegionStack extends cdk.Stack {
  public testMsgFanOut: ITopic;
  public testResultsQName: string;

  constructor(scope: Construct, id: string, props: HomeStackProps) {
    super(scope, id, props);
  

    const homeRegion = cdk.Stack.of(this).region;

    // Queue to recieve the SNS message, emptied by `test-runner` in home region
    const remoteRcvQ = new sqs.Queue(this, 'remote-recv-Q', {
      visibilityTimeout: Duration.minutes(4),
      queueName: 'remote-recv-Q',
      retentionPeriod: Duration.minutes(5)
    });

    this.testResultsQName = 'test-result-collector-Q'

    // Queue to recieve the SNS message, emptied by `test-runner` in home region
    const testResultCollectorQ = new sqs.Queue(this, this.testResultsQName, {
      visibilityTimeout: Duration.minutes(4),
      queueName: this.testResultsQName,
      retentionPeriod: Duration.minutes(5)
    });

    testResultCollectorQ.grantSendMessages(new iam.ServicePrincipal('lambda.amazonaws.com'));

    // create SSM parameter to store the Queue URL for test-result-collector-Q
    const resultCollectorQSSMParameter = new ssm.StringParameter(this, 'resultCollectorQUrl', {
      parameterName: `resultCollectorQUrl`,
      stringValue: testResultCollectorQ.queueUrl
    })

    this.testMsgFanOut = new sns.Topic(this, 'test-msg-fan-out', {
      topicName: 'test-msg-fan-out'
    });

    remoteRcvQ.grantSendMessages(new iam.ServicePrincipal('sns.amazonaws.com'));

    // Home region queue for test-runner subscribe and only rcv applicable msgs
    this.testMsgFanOut.addSubscription(new SqsSubscription(remoteRcvQ, {
      rawMessageDelivery: false,
      filterPolicy: {
        [`${homeRegion}`]: sns.SubscriptionFilter.stringFilter({
          allowlist: ['location']
        })
      }
    }));

    // Lambda to add MessageAttributes for SNS routing
    const testRoutePackagerLambda = new lambda.Function(this, 'test-route-packager', {
      functionName: 'test-route-packager',
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda-fns/test-route-packager'),
      handler: 'index.handler',
      environment: {
        TOPIC_ARN: this.testMsgFanOut.topicArn
      },
    });

    // Generate a Function URL for test-route-packager and grant privileges to tests-crud to invoke
    const testRoutePackagerUrlFunc = new lambda.FunctionUrl(this, 'route-packager-url-func', {
      function: testRoutePackagerLambda
    });

    const serverApp = new ServerApp(this, 'tests-crud', {
        pgInstance: props.pgInstance,
        testRoutePackagerUrl: testRoutePackagerUrlFunc.url,
        testRoutePackagerLambda
      });

    testRoutePackagerUrlFunc.grantInvokeUrl(serverApp.ebInstanceRole);

    // SNS permits the packager Lambda to publish a msg to a topic
    this.testMsgFanOut.grantPublish(testRoutePackagerLambda);

    // Lambda to run actual HTTP tests and send on the results
    const testRunnerLambda = new lambda.Function(this, 'test-runner', {
      functionName: 'test-runner',
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda-fns/test-runner'),
      handler: 'index.handler',
      timeout: cdk.Duration.seconds(20),
      onSuccess: new cdk.aws_lambda_destinations.SqsDestination(testResultCollectorQ),
    });

    // SQS in front of test-runner, allow Lambda read+delete msgs
    remoteRcvQ.grantConsumeMessages(testRunnerLambda);

    // Lambda set to be triggered by remote-rcv SQS receiving a message
    testRunnerLambda.addEventSource(new SqsEventSource(remoteRcvQ, {
      batchSize: 1,
      enabled: true
    }));

    // Lambda to process test results and write them to DB
    const testResultWriterLambda = new lambda.Function(this, 'test-result-writer', {
      functionName: 'test-result-writer',
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda-fns/test-result-writer'),
      handler: 'index.handler',
      timeout: cdk.Duration.seconds(20),
      environment: { 
        DB_USER: `${process.env.DB_USER}`, 
        DB_HOST: `${process.env.DB_HOST}`, 
        DB_NAME: `${process.env.DB_NAME}`, 
        DB_PW: `${process.env.DB_PW}`, 
        DB_PORT: `${process.env.DB_PORT}` 
      }
    });

    // SQS for collecting test results, allow Lambda read+delete msgs
    testResultCollectorQ.grantConsumeMessages(testResultWriterLambda);

    // Lambda set to be triggered by test-collector SQS receiving a msg
    testResultWriterLambda.addEventSource(new SqsEventSource(testResultCollectorQ, {
      batchSize: 1,
      enabled: true
    }));

    // Lambda to process test results and write them to DB
    const testAlertLambda = new lambda.Function(this, 'test-alerts', {
      functionName: 'test-alerts',
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda-fns/test-alerts'),
      handler: 'index.handler',
      timeout: cdk.Duration.seconds(20),
      environment: { 
        DB_USER: `${process.env.DB_USER}`, 
        DB_HOST: `${process.env.DB_HOST}`, 
        DB_NAME: `${process.env.DB_NAME}`, 
        DB_PW: `${process.env.DB_PW}`, 
        DB_PORT: `${process.env.DB_PORT}` 
      }
    });

    testAlertLambda.grantInvoke(testResultWriterLambda);

  }
}
