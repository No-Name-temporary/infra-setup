import 'dotenv/config';
import cdk = require('aws-cdk-lib');
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { Duration } from 'aws-cdk-lib';


const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

interface ProvisionStackProps extends cdk.StackProps {
  routePackagerFuncUrl: string;  
  frontendBucketName: string;
}

export class ProvisionStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ProvisionStackProps) {
    super(scope, id, props);

    const currRegion = cdk.Stack.of(this).region;
    console.log("remoteRegion: ", currRegion);

    const prepFrontendConfig = new lambda.Function(this, 'prep-frontend-config', {
      functionName: 'prep-frontend-config',
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda-fns/prep-frontend'),
      handler: 'index.handler',
      timeout: Duration.seconds(20),
      environment: {
        accessKeyId: `${AWS_ACCESS_KEY_ID}`,
        secretAccessKey: `${AWS_SECRET_ACCESS_KEY}`, 
        routePackagerFuncUrl: props.routePackagerFuncUrl,
        frontendBucketName: props.frontendBucketName
      }
    });
  }
}


