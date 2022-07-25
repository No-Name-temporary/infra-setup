#!/usr/bin/env node
// import 'dotenv/config';
import * as cdk from 'aws-cdk-lib';
// import { FrontendStack } from '../lib/frontend-stack';
// import { HomeRegionStack } from '../lib/home-region-stack';
// import { RemoteRegionStack} from '../lib/remote-region-stack';
import { DatabaseStack } from '../lib/database-stack';

// import { allAWSRegions } from '../constants/aws-configs';

const { account, HOME_REGION } =  process.env;


const app = new cdk.App();

// const frontend = new FrontendStack(app, 'FrontendStack', {
//   env: { account, region: HOME_REGION }, 
// });

const database = new DatabaseStack(app, 'SeymourDB', { 
  env: { account, region: HOME_REGION }
});

// const homeStack = new HomeRegionStack(app, 'HomeRegionStack', { 
//   env: { account, region: HOME_REGION },
//   pgInstance: database.pgInstance,
// });

// const remoteRegions = allAWSRegions.filter(region => region !== HOME_REGION);

// new RemoteRegionStack(app, 'RemoteRegionStack', {
//   env: { account, region: 'ca-central-1' }, 
//   testMsgFanOut: homeStack.testMsgFanOut,
//   resultCollectorQUrl: homeStack.testResultCollectorQ.queueUrl,
// });

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

