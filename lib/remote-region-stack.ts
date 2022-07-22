import cdk = require('aws-cdk-lib');
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Construct } from 'constructs';
import { Duration } from 'aws-cdk-lib';
import { ITopic } from 'aws-cdk-lib/aws-sns';


interface HomeStackProps extends cdk.StackProps {
  testMsgFanOut: ITopic,
}

export class RemoteRegionStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: HomeStackProps) {
    super(scope, id, props);

    const accountId = cdk.Stack.of(this).account;
    const currRegion = cdk.Stack.of(this).region;
    console.log("Remote Region // accountId: ", accountId, "currRegion: ", currRegion);

    const remoteRcvQ = new sqs.Queue(this, 'remote-recv-Q', {
      visibilityTimeout: Duration.minutes(4),
      queueName: 'remote-recv-Q',
      retentionPeriod: Duration.minutes(5)
    });


    const SNSSubscription = new sns.CfnSubscription(this, `remote-sub-${currRegion}`, {
      topicArn: props.testMsgFanOut.topicArn,
      filterPolicy: { "location": [ `${currRegion}` ] },
      endpoint: remoteRcvQ.queueArn,
      protocol: "sqs",
      rawMessageDelivery: false,
      region: "us-east-1"
  });

    const testRunnerLambda = new lambda.Function(this, 'test-runner', {
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
