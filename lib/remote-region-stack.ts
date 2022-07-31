import 'dotenv/config';
import cdk = require('aws-cdk-lib');
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Construct } from 'constructs';
import { Duration } from 'aws-cdk-lib';
import { ITopic } from 'aws-cdk-lib/aws-sns';


interface RemoteStackProps extends cdk.StackProps {
  testMsgFanOut: ITopic
}

export class RemoteRegionStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: RemoteStackProps) {
    super(scope, id, props);

    const { HOME_REGION, account } = process.env;
    const currRegion = cdk.Stack.of(this).region;

    const remoteRcvQ = new sqs.Queue(this, 'remote-recv-Q', {
      visibilityTimeout: Duration.minutes(4),
      queueName: 'remote-recv-Q',
      retentionPeriod: Duration.minutes(5)
    });

    remoteRcvQ.grantSendMessages(new iam.ServicePrincipal('sns.amazonaws.com'));

    const SNSSubscription = new sns.CfnSubscription(this, `remote-sub-${currRegion}`, {
      topicArn: props.testMsgFanOut.topicArn,
      filterPolicy: {
        [`${currRegion}`]: ['location']
      },
      endpoint: remoteRcvQ.queueArn,
      protocol: "sqs",
      rawMessageDelivery: false,
      region: HOME_REGION
    });
    
    const testRunnerLambda = new lambda.Function(this, 'test-runner', {
      functionName: 'test-runner',
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda-fns/test-runner'),
      handler: 'index.handler',
      timeout: cdk.Duration.seconds(20),
      environment: {
        HOME_REGION: `${HOME_REGION}`,
      }
    });

    const ssmGetParamPolicy = new iam.PolicyStatement({
      actions: ['ssm:GetParameter'],
      resources: [`arn:aws:ssm:${HOME_REGION}:${account}:*`],
    });

    testRunnerLambda.role?.attachInlinePolicy(
      new iam.Policy(this, 'ssm-allow-get-param', {
        statements: [ssmGetParamPolicy],
      }),
    );

    remoteRcvQ.grantConsumeMessages(testRunnerLambda);
    
    testRunnerLambda.addEventSource(new SqsEventSource(remoteRcvQ, {
      batchSize: 1,
      enabled: true
    }));

  }
}
