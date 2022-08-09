import 'dotenv/config';
import cdk = require('aws-cdk-lib');
import * as s3assets from 'aws-cdk-lib/aws-s3-assets';
import * as eb from 'aws-cdk-lib/aws-elasticbeanstalk';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { IRole } from 'aws-cdk-lib/aws-iam';

const path = require('path');


export interface ServerAppProps {
  pgInstance: rds.DatabaseInstance
  testRoutePackagerUrl: string
  testRoutePackagerLambda: lambda.Function
}

export class ServerApp extends Construct {
  public ebInstanceRole: IRole
  public ebApp: eb.CfnEnvironment

  constructor(scope: Construct, id: string, props: ServerAppProps ) {
    super(scope, id);
    
    const { HOME_REGION, EB_PORT, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,
      DB_NAME, DB_USER, DB_PW, DB_PORT
    } = process.env;
    const appName = 'tests-crud';

    // Create S3 asset from the ZIP file of the tests-crud app
    const ebZipArchive = new s3assets.Asset(this, 'testsCrudAppZip', {
      path: path.join(__dirname, '..', 'server', 'tests-crud.zip'),
    });
    
    // Elastic Beanstalk IAM Roles
    this.ebInstanceRole = new iam.Role(this, `${appName}-aws-elasticbeanstalk-ec2-role`, {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });

    const managedPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWebTier')
    this.ebInstanceRole.addManagedPolicy(managedPolicy);

    const allowAllEventBridgePolicy = iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEventBridgeFullAccess')
    this.ebInstanceRole.addManagedPolicy(allowAllEventBridgePolicy);


    const profileName = `${appName}-InstanceProfile`
    const instanceProfile = new iam.CfnInstanceProfile(this, profileName, {
      instanceProfileName: profileName,
      roles: [
        this.ebInstanceRole.roleName
      ]
    });

    const node = this.node;
    const platform = node.tryGetContext("platform");

    const optionSettingProperties: eb.CfnEnvironment.OptionSettingProperty[] = [
      {
        namespace: 'aws:autoscaling:launchconfiguration',
        optionName: 'InstanceType',
        value: 't2.micro',
      },
      {
        namespace: 'aws:autoscaling:launchconfiguration',
        optionName: 'IamInstanceProfile',
        value: profileName
      },
      {
        namespace: "aws:elasticbeanstalk:application:environment",
        optionName: "AWS_ACCESS_KEY_ID",
        value: AWS_ACCESS_KEY_ID
      },
      {
        namespace: "aws:elasticbeanstalk:application:environment",
        optionName: "AWS_REGION",
        value: HOME_REGION
      },
      {
        namespace: "aws:elasticbeanstalk:application:environment",
        optionName: "AWS_SECRET_ACCESS_KEY",
        value: AWS_SECRET_ACCESS_KEY
      },
      {
        namespace: "aws:elasticbeanstalk:application:environment",
        optionName: "DB_HOST",
        value: props.pgInstance.dbInstanceEndpointAddress
      },
      {
        namespace: "aws:elasticbeanstalk:application:environment",
        optionName: "DB_NAME",
        value: DB_NAME
      },
      {
        namespace: "aws:elasticbeanstalk:application:environment",
        optionName: "DB_PORT",
        value: DB_PORT
      },
      {
        namespace: "aws:elasticbeanstalk:application:environment",
        optionName: "DB_PW",
        value: DB_PW
      },
      {
        namespace: "aws:elasticbeanstalk:application:environment",
        optionName: "DB_USER",
        value: DB_USER
      },
      {
        namespace: "aws:elasticbeanstalk:application:environment",
        optionName: "PORT",
        value: EB_PORT
      },
      {
        namespace: "aws:elasticbeanstalk:application:environment",
        optionName: "TEST_ROUTE_PACKAGER_URL",
        value: props.testRoutePackagerUrl
      },
      {
        namespace: "aws:elasticbeanstalk:application:environment",
        optionName: "TEST_ROUTE_PACKAGER_ARN",
        value: props.testRoutePackagerLambda.functionArn
      },
      {
        namespace: "aws:elasticbeanstalk:application:environment",
        optionName: "TEST_ROUTE_PACKAGER_NAME",
        value: props.testRoutePackagerLambda.functionName
      },
    ];

    // ElasticBeanstalk Application
    const app = new eb.CfnApplication(this, 'Application', {
      applicationName: `${appName}-EB-App`
    });

    const appVersionProps = new eb.CfnApplicationVersion(this, 'AppVersion', {
      applicationName: `${appName}-EB-App`,
      sourceBundle: {
          s3Bucket: ebZipArchive.s3BucketName,
          s3Key: ebZipArchive.s3ObjectKey,
      },
    });

    // ElasticBeanstalk App Environment
    const env = new eb.CfnEnvironment(this, 'Environment', {
      environmentName: `${appName}-EB-Env`,
      applicationName: `${appName}-EB-App`,
      platformArn: platform,
      solutionStackName: '64bit Amazon Linux 2 v5.5.4 running Node.js 16',
      optionSettings: optionSettingProperties,
      versionLabel: appVersionProps.ref,
    });

    appVersionProps.addDependsOn(app);
    env.addDependsOn(app);

    // create SSM parameter to store the endpoint to access App Server
    new ssm.StringParameter(this, 'ebServerEndpoint', {
      parameterName: `ebServerEndpoint`,
      stringValue: env.attrEndpointUrl
    })

    this.ebApp = env;

    // Output the URL endpoint at which to access tests-crud app
    new cdk.CfnOutput(this, 'testsCrudEndpointUrl', {
      value: env.attrEndpointUrl,
    });
  }
}