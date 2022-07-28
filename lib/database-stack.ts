import 'dotenv/config';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Duration, Token } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CdkResourceInitializer } from './resource-init-rds';
// import { DockerImageCode } from 'aws-cdk-lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';


export class DatabaseStack extends cdk.Stack {
  public vpc: ec2.Vpc;
  public pgInstance: rds.DatabaseInstance;
  
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const username = `${process.env.DB_USER}`;
    const password = cdk.SecretValue.unsafePlainText(`${process.env.DB_PW}`);
    const dbName = `${process.env.DB_NAME}`;
    const dbPort = Number(process.env.DB_PORT);
    console.log("database-stack username: ", username);
    
    this.vpc = new ec2.Vpc(this, 'VPC', {
      maxAzs: 2,
      subnetConfiguration: [
        {
          name: 'public-subnet-1',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
      ],
    });

    this.pgInstance = new rds.DatabaseInstance(this, 'Postgres', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_13_4,
      }),
      vpc: this.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE3,
        ec2.InstanceSize.MICRO,
      ),
      credentials: { username, password },
      allocatedStorage: 20,
      backupRetention: cdk.Duration.days(0),
      deleteAutomatedBackups: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      deletionProtection: false,
      databaseName: dbName,
      publiclyAccessible: true,
      port: dbPort
    });

    this.pgInstance.connections.allowDefaultPortFromAnyIpv4();
    this.pgInstance.connections.allowDefaultPortInternally();

    const host = this.pgInstance.dbInstanceEndpointAddress;

    const initializer = new CdkResourceInitializer(this, 'SeymourRdsInit', {
      config: {  password: password.unsafeUnwrap(), host, dbPort, username, dbName },
      fnLogRetention: RetentionDays.ONE_WEEK,
      fnCode: lambda.Code.fromAsset('lambda-fns/init-rds'),
      fnTimeout: Duration.minutes(3),
      fnSecurityGroups: [],
      allowPublicSubnet: true,
      vpc: this.vpc,
      subnetsSelection: this.vpc.selectSubnets({
        subnetType: ec2.SubnetType.PUBLIC
      })
    })

    // manage resources dependency
    initializer.customResource.node.addDependency(this.pgInstance)

    /* eslint no-new: 0 */
    new cdk.CfnOutput(this, 'RdsInitFnResponse', {
      value: Token.asString(initializer.response)
    })

    // Output the postgres database address for manually connection if desired
    new cdk.CfnOutput(this, 'postgresDbEndpoint', {
      value: this.pgInstance.instanceEndpoint.hostname,
    });
  }
}
