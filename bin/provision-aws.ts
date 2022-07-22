#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
// import * as sns from 'aws-cdk-lib';
import { HomeRegionStack } from '../lib/home-region-stack';
import { RemoteRegionStack} from '../lib/remote-region-stack';

const account =  '026391791342';

const app = new cdk.App();

const homeStack = new HomeRegionStack(app, 'HomeRegionStack', 
  { env: { account, region: 'us-east-1' } });
const remoteStack = new RemoteRegionStack(app, 'RemoteRegionStack', 
  { env: { account, region: 'ca-central-1' }, testMsgFanOut: homeStack.testMsgFanOut });


// const remoteRegions = [ 'us-west-1', 'ca-central-1', 'eu-north-1'];
// const remoteEnvs = remoteRegions.map(region => { 
//   return { account, region };
// });

// const app = new cdk.App();
// remoteEnvs.forEach(env => new ProvisionAwsStack(app, `Stack-${env.region}`, { env }));

