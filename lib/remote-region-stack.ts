import 'dotenv/config';
import cdk = require('aws-cdk-lib');
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as lambda from 'aws-cdk-lib/aws-lambda';
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

    const { HOME_REGION } = process.env;
    const currRegion = cdk.Stack.of(this).region;
    console.log("remoteRegion: ", currRegion);

    const remoteRcvQ = new sqs.Queue(this, 'remote-recv-Q', {
      visibilityTimeout: Duration.minutes(4),
      queueName: 'remote-recv-Q',
      retentionPeriod: Duration.minutes(5)
    });


    const SNSSubscription = new sns.CfnSubscription(this, `remote-sub-${currRegion}`, {
      topicArn: props.testMsgFanOut.topicArn,
      filterPolicy: { "locations": [ `${currRegion}` ] },
      endpoint: remoteRcvQ.queueArn,
      protocol: "sqs",
      rawMessageDelivery: false,
      region: "us-east-1"
    });
    
    // Read in the Queue URL to send to test-result-collector-Q
    // const resultCollectorQUrl = ssm.StringParameter.fromStringParameterAttributes(this, 'resultCollectorQUrl', {
    //   parameterName: 'resultCollectorQUrl',
    // }).stringValue;

    // Read in the Queue ARN for test-result-collector-Q
    // const resultCollectorQArn = ssm.StringParameter.fromStringParameterAttributes(this, 'resultCollectorQArn', {
    //   parameterName: 'resultCollectorQArn',
    // }).stringValue;

    const testRunnerLambda = new lambda.Function(this, 'test-runner', {
      functionName: 'test-runner',
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda-fns/test-runner'),
      handler: 'index.handler',
      timeout: cdk.Duration.seconds(20),
      environment: {
        HOME_REGION: `${HOME_REGION}`,
      }
      // onSuccess: new cdk.aws_lambda_destinations.SqsDestination(/* Use Arn?? Check Docs */),
    });

    remoteRcvQ.grantConsumeMessages(testRunnerLambda);
    testRunnerLambda.addEventSource(new SqsEventSource(remoteRcvQ, {
      batchSize: 1,
      enabled: true
    }));

  }
}
