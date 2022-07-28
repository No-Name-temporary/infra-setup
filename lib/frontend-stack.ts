import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { StarPrincipal } from 'aws-cdk-lib/aws-iam';


export class FrontendStack extends cdk.Stack {
  public frontendS3Bucket: s3.Bucket;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //Create new s3 bucket to hold frontend UI app
    this.frontendS3Bucket = new s3.Bucket(this, 'seymour-test-frontend-s3-bucket', {
      bucketName: 'seymour-react-temp-frontend-bucket',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      publicReadAccess: true,
      websiteIndexDocument: "index.html",
      blockPublicAccess: new s3.BlockPublicAccess({ restrictPublicBuckets: false })
    });

    // Allow anyone read access to the frontend s3 bucket
    this.frontendS3Bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['s3:GetObject'],
        principals: [new StarPrincipal()],
        resources: [  `${this.frontendS3Bucket.bucketArn}/*` ],
      }),
    );
    
    // Read in the endpoint at which to access backend server app
    const ebServerEndpoint = ssm.StringParameter.fromStringParameterAttributes(this, 'ebServerEndpoint', {
      parameterName: 'ebServerEndpoint',
    }).stringValue;

    // Deploy frontend app + create config.json file
    const deployment = new cdk.aws_s3_deployment.
      BucketDeployment(this, 'deploy-frontend-bucket', {
        sources: [
          cdk.aws_s3_deployment.Source.asset('../provision-aws/frontend'),
          cdk.aws_s3_deployment.Source.jsonData('config.json', { URL: ebServerEndpoint })
        ],
        destinationBucket: this.frontendS3Bucket
    })

    // Output the URL endpoint at which to access the frontend
    new cdk.CfnOutput(this, 'frontendWebsiteUrl', {
      value: this.frontendS3Bucket.bucketWebsiteUrl,
    });

    // Output the URL endpoint at which to access the backend
    new cdk.CfnOutput(this, 'backendServerEndpoint', {
      value: ebServerEndpoint,
    });
  }
}