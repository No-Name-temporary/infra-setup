import 'dotenv/config';
import cdk = require('aws-cdk-lib');
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as rds from 'aws-cdk-lib/aws-rds';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Duration } from 'aws-cdk-lib';
import { SqsSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { ITopic } from 'aws-cdk-lib/aws-sns';
import { IQueue } from 'aws-cdk-lib/aws-sqs';
import { ServerStack } from './server-stack';


interface HomeStackProps extends cdk.StackProps {
  pgInstance: rds.DatabaseInstance;
}

export class HomeRegionStack extends cdk.Stack {
  public testMsgFanOut: ITopic;
  public testResultCollectorQ: IQueue;
  public env: cdk.Stack;

  constructor(scope: Construct, id: string, props: HomeStackProps) {
    super(scope, id, props);

    const homeRegion = cdk.Stack.of(this).region;
    const account = cdk.Stack.of(this).account;
    console.log("homeRegion: ", homeRegion);


    // Queue to recieve the SNS message, emptied by `test-runner` in home region
    const remoteRcvQ = new sqs.Queue(this, 'remote-recv-Q', {
      visibilityTimeout: Duration.minutes(4),
      queueName: 'remote-recv-Q',
      retentionPeriod: Duration.minutes(5)
    });

    // Queue to recieve the SNS message, emptied by `test-runner` in home region
    this.testResultCollectorQ = new sqs.Queue(this, 'test-result-collector-Q', {
      visibilityTimeout: Duration.minutes(4),
      queueName: 'test-result-collector-Q',
      retentionPeriod: Duration.minutes(5)
    });

    this.testMsgFanOut = new sns.Topic(this, 'test-msg-fan-out', {
      topicName: 'test-msg-fan-out'
    });
    // this.msgFanOutSNSArn = testMsgFanOut.topicArn;

    // Home region queue for test-runner subscribe and only rcv applicable msgs
    this.testMsgFanOut.addSubscription(new SqsSubscription(remoteRcvQ, {
      rawMessageDelivery: false,
      filterPolicy: {
        location: sns.SubscriptionFilter.stringFilter({
          allowlist: [`${homeRegion}`]
        })
      }
    }));

    // Lambda to add MessageAttributes for SNS routing
    const testRoutePackagerLambda = new lambda.Function(this, 'test-route-packager', {
      functionName: 'test-route-packager',
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda-fns/test-route-packager'),
      handler: 'index.handler',
      onSuccess: new cdk.aws_lambda_destinations.SnsDestination(this.testMsgFanOut),
    });

    // Generate a Function URL for test-route-packager and grant privileges to tests-crud to invoke
    const testRoutePackagerUrlFunc = new lambda.FunctionUrl(this, 'route-packager-url-func', {
      function: testRoutePackagerLambda
    });

    const serverStack = new ServerStack(this, 'tests-crud', {
      env: { account, region: homeRegion }, 
      pgInstance: props.pgInstance,
      testRoutePackagerUrl: testRoutePackagerUrlFunc.url,
    });

    testRoutePackagerUrlFunc.grantInvokeUrl(serverStack.ebInstanceRole);
  

    // SNS permits the packager Lambda to publish a msg to a topic
    this.testMsgFanOut.grantPublish(testRoutePackagerLambda);

    // Lambda to run actual HTTP tests and send on the results
    const testRunnerLambda = new lambda.Function(this, 'test-runner', {
      functionName: 'test-runner',
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda-fns/test-runner'),
      handler: 'index.handler',
      timeout: cdk.Duration.seconds(20),
      onSuccess: new cdk.aws_lambda_destinations.SqsDestination(this.testResultCollectorQ),
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
    });

    // SQS for collecting test results, allow Lambda read+delete msgs
    this.testResultCollectorQ.grantConsumeMessages(testResultWriterLambda);

    // Lambda set to be triggered by test-collector SQS receiving a msg
    testResultWriterLambda.addEventSource(new SqsEventSource(this.testResultCollectorQ, {
      batchSize: 1,
      enabled: true
    }));

  }
}
