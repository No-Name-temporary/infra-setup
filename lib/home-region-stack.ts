import 'dotenv/config';
import cdk = require('aws-cdk-lib');
import * as eb from 'aws-cdk-lib/aws-elasticbeanstalk';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Duration } from 'aws-cdk-lib';
import { SqsSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { ITopic } from 'aws-cdk-lib/aws-sns';


export class HomeRegionStack extends cdk.Stack {

  public testMsgFanOut: ITopic;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const accountId = cdk.Stack.of(this).account;
    const currRegion = cdk.Stack.of(this).region;
    console.log("Home Region // accountId: ", accountId, "currRegion: ", currRegion);

    const { HOME_REGION } = process.env;
    const appName = 'tests-crud';
    
    // EBS IAM Roles
    const EbInstanceRole = new iam.Role(this, `${appName}-aws-elasticbeanstalk-ec2-role`, {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });

    const managedPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWebTier')
    EbInstanceRole.addManagedPolicy(managedPolicy);

    const profileName = `${appName}-InstanceProfile`
    const instanceProfile = new iam.CfnInstanceProfile(this, profileName, {
      instanceProfileName: profileName,
      roles: [
        EbInstanceRole.roleName
      ]
    });

    const node = this.node;
    const platform = node.tryGetContext("platform");

    const optionSettingProperties: eb.CfnEnvironment.OptionSettingProperty[] = [
      {
        namespace: 'aws:autoscaling:launchconfiguration',
        optionName: 'InstanceType',
        value: 't3.small',
      },
      {
        namespace: 'aws:autoscaling:launchconfiguration',
        optionName: 'IamInstanceProfile',
        value: profileName
      },
      {
        namespace: "aws:elasticbeanstalk:application:environment",
        optionName: "VAR_AVAIL_IN_TESTS_CRUD",
        value: "this value should be accessible from within the deployed app"
      }
    ];

    // ElasticBeanstalk Application
    const app = new eb.CfnApplication(this, 'Application', {
      applicationName: `${appName}-EB-App`
    });

    // ElasticBeanstalk App Environment
    const env = new eb.CfnEnvironment(this, 'Environment', {
      environmentName: `${appName}-EB-Env`,
      applicationName: `${appName}-EB-App`,
      platformArn: platform,
      solutionStackName: '64bit Amazon Linux 2 v5.5.4 running Node.js 16',
      optionSettings: optionSettingProperties
    });

    env.addDependsOn(app);


    // Queue to recieve the SNS message, emptied by `test-runner` in home region
    const remoteRcvQ = new sqs.Queue(this, 'remote-recv-Q', {
      visibilityTimeout: Duration.minutes(4),
      queueName: 'remote-recv-Q',
      retentionPeriod: Duration.minutes(5)
    });

    // Queue to recieve the SNS message, emptied by `test-runner` in home region
    const testResultCollectorQ = new sqs.Queue(this, 'test-result-collector-Q', {
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
          allowlist: [`${HOME_REGION}`]
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

    // SNS permits the packager Lambda to publish a msg to a topic
    this.testMsgFanOut.grantPublish(testRoutePackagerLambda);

    // Lambda to run actual HTTP tests and send on the results
    const testRunnerLambda = new lambda.Function(this, 'test-runner', {
      functionName: 'test-runner',
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda-fns/test-runner'),
      handler: 'index.handler',
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
    });

    // SQS for collecting test results, allow Lambda read+delete msgs
    testResultCollectorQ.grantConsumeMessages(testResultWriterLambda);

    // Lambda set to be triggered by test-collector SQS receiving a msg
    testResultWriterLambda.addEventSource(new SqsEventSource(testResultCollectorQ, {
      batchSize: 1,
      enabled: true
    }));

  }
}
