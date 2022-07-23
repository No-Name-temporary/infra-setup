import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { StarPrincipal } from 'aws-cdk-lib/aws-iam';


export class FrontendStack extends cdk.Stack {
  public frontendS3Bucket: s3.Bucket;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

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

    // Allow lambda service to add objects to the frontend s3 bucket
    this.frontendS3Bucket.policy?.document.addStatements(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal('lambda.amazonaws.com')],
        actions: ['s3:PutObject'],
        resources: [this.frontendS3Bucket.bucketArn],
      }),
    );
    
    const deployment = new cdk.aws_s3_deployment.
      BucketDeployment(this, 'deploy-frontend-bucket', {
        sources: [cdk.aws_s3_deployment.Source.asset('../frontend')],
        destinationBucket: this.frontendS3Bucket
    })
  }
}