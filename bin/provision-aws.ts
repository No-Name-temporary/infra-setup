#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ProvisionAwsStack } from '../lib/provision-aws-stack';

const account =  '026391791342';

// Single stack deployment, normally how it is done
// const califEnv = { account, region: 'us-west-1' }; //manually specifying the environment
const usEastEnv = { account, region: 'us-east-1' };

const app = new cdk.App();
new ProvisionAwsStack(app, 'ProvisionAwsStack', { env: usEastEnv });

// Multiple Stacks created at once... feels hacky bc not in pipeline

// const remoteRegions = [ 'us-west-1', 'ca-central-1', 'eu-north-1'];
// const remoteEnvs = remoteRegions.map(region => { 
//   return { account, region };
// });

// const app = new cdk.App();
// remoteEnvs.forEach(env => new ProvisionAwsStack(app, `Stack-${env.region}`, { env }));

