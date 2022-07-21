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


export class ProvisionAwsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const { ACCOUNT, HOME_REGION } = process.env;
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

    // EBS Application and Environment
    const app = new eb.CfnApplication(this, 'Application', {
      applicationName: `${appName}-EB-App`
    });

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

    const testMsgFanOut = new sns.Topic(this, 'test-msg-fan-out');

    // Home region queue for test-runner subscribe and only rcv applicable msgs
    testMsgFanOut.addSubscription(new SqsSubscription(remoteRcvQ, {
      rawMessageDelivery: false,
      filterPolicy: {
        location: sns.SubscriptionFilter.stringFilter({
          allowlist: [`${HOME_REGION}`]
        })
      }
    }));


    const testRoutePackagerLambda = new lambda.Function(this, 'test-route-packager', {
      functionName: 'test-route-packager',
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda-fns/test-route-packager'),
      handler: 'index.handler',
      onSuccess: new cdk.aws_lambda_destinations.SnsDestination(testMsgFanOut),
    });

    testMsgFanOut.grantPublish(testRoutePackagerLambda);

    const testRunnerLambda = new lambda.Function(this, 'test-runner', {
      functionName: 'test-runner',
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda-fns/test-runner'),
      handler: 'index.handler',
    });

    remoteRcvQ.grantConsumeMessages(testRunnerLambda);
    testRunnerLambda.addEventSource(new SqsEventSource(remoteRcvQ, {
      batchSize: 1,
      enabled: true
    }));

  }
}
