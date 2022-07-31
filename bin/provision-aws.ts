#!/usr/bin/env node
import 'dotenv/config';
import * as cdk from 'aws-cdk-lib';
import { FrontendStack } from '../lib/frontend-stack';
import { HomeRegionStack } from '../lib/home-region-stack';
import { RemoteRegionStack} from '../lib/remote-region-stack';
import { DatabaseStack } from '../lib/database-stack';

// import { allAWSRegions } from '../constants/aws-configs';

const { account, HOME_REGION } =  process.env;


const app = new cdk.App();

const database = new DatabaseStack(app, 'SeymourDB', { 
  env: { account, region: HOME_REGION }
});

const homeStack = new HomeRegionStack(app, 'HomeRegionStack', { 
  env: { account, region: HOME_REGION },
  pgInstance: database.pgInstance,
});

homeStack.addDependency(database);

const frontendStack = new FrontendStack(app, 'FrontendStack', {
  env: { account, region: HOME_REGION },
});

frontendStack.addDependency(homeStack);
// const remoteRegions = allAWSRegions.filter(region => region !== HOME_REGION);

const remoteStack = new RemoteRegionStack(app, 'RemoteRegionStack', {
  env: { account, region: 'ca-central-1' }, 
  testMsgFanOut: homeStack.testMsgFanOut,
  testResultsQName: homeStack.testResultsQName
});

remoteStack.addDependency(homeStack);

// new cdk.CfnOutput(database, 'postgresDbEndpoint', {
//   value: database.pgInstance.instanceEndpoint.hostname,
// });

// new cdk.CfnOutput(homeStack, 'postgresDbEndpoint', {
//   value: homeStack.env,
// });

// remoteRegions.forEach(region => {
//   new RemoteRegionStack(app, 'RemoteRegionStack', 
//   { env: { account, region }, 
//     testMsgFanOut: homeStack.testMsgFanOut,
//     testResultCollectorQ: homeStack.testResultCollectorQ,
//   });
// });

