import 'dotenv/config';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';


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

    // Output the postgres database address for manually connection if desired
    new cdk.CfnOutput(this, 'postgresDbEndpoint', {
      value: this.pgInstance.instanceEndpoint.hostname,
    });
  }
}
