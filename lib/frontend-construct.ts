import 'dotenv/config';
import cdk = require('aws-cdk-lib');
import * as s3assets from 'aws-cdk-lib/aws-s3-assets';
import * as eb from 'aws-cdk-lib/aws-elasticbeanstalk';
import * as iam from 'aws-cdk-lib/aws-iam';
// import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';


export interface FrontendAppProps {
  serverApp: eb.CfnEnvironment
}

export class FrontendApp extends Construct {

  constructor(scope: Construct, id: string, props: FrontendAppProps ) {
    super(scope, id);
    
    // const { HOME_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,
    //   DB_NAME, DB_USER, DB_PW, DB_PORT
    // } = process.env;
    const appName = 'seymour-frontend';

    // Create S3 asset from the ZIP file of the tests-crud app
    const ebZipArchive = new s3assets.Asset(this, 'frontendAppZip', {
      path: '../provision-aws/frontend-zip/fullApp.zip',
    });
    
    // Elastic Beanstalk IAM Roles
    const ebInstanceRole = new iam.Role(this, `${appName}-aws-elasticbeanstalk-ec2-role`, {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });

    const managedPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWebTier')
    ebInstanceRole.addManagedPolicy(managedPolicy);


    const profileName = `${appName}-InstanceProfile`
    const instanceProfile = new iam.CfnInstanceProfile(this, profileName, {
      instanceProfileName: profileName,
      roles: [
        ebInstanceRole.roleName
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
        optionName: "PORT",
        value: '3000'
      },
      {
        namespace: "aws:elasticbeanstalk:application:environment",
        optionName: "serverAppURL",
        value: props.serverApp.attrEndpointUrl
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

    // // create SSM parameter to store the endpoint to access App Server
    // new ssm.StringParameter(this, 'ebServerEndpoint', {
    //   parameterName: `ebServerEndpoint`,
    //   stringValue: env.attrEndpointUrl
    // })

    // Output the URL endpoint at which to access tests-crud app
    new cdk.CfnOutput(this, 'SeymourFrontendUrl', {
      value: env.attrEndpointUrl,
    });
  }
}