#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const cdk = require("aws-cdk-lib");
const home_region_stack_1 = require("../lib/home-region-stack");
const remote_region_stack_1 = require("../lib/remote-region-stack");
const database_stack_1 = require("../lib/database-stack");
// import { allAWSRegions } from '../constants/aws-configs';
const { account, HOME_REGION } = process.env;
const app = new cdk.App();
// const frontend = new 
const database = new database_stack_1.DatabaseStack(app, 'SeymourDB', {
    env: { account, region: HOME_REGION }
});
const homeStack = new home_region_stack_1.HomeRegionStack(app, 'HomeRegionStack', {
    env: { account, region: HOME_REGION },
    pgInstance: database.pgInstance,
});
// const remoteRegions = allAWSRegions.filter(region => region !== HOME_REGION);
new remote_region_stack_1.RemoteRegionStack(app, 'RemoteRegionStack', {
    env: { account, region: 'ca-central-1' },
    testMsgFanOut: homeStack.testMsgFanOut,
    resultCollectorQUrl: homeStack.testResultCollectorQ.queueUrl,
});
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlzaW9uLWF3cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByb3Zpc2lvbi1hd3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EseUJBQXVCO0FBQ3ZCLG1DQUFtQztBQUNuQyxnRUFBMkQ7QUFDM0Qsb0VBQThEO0FBQzlELDBEQUFzRDtBQUV0RCw0REFBNEQ7QUFFNUQsTUFBTSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsR0FBSSxPQUFPLENBQUMsR0FBRyxDQUFDO0FBRzlDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLHdCQUF3QjtBQUV4QixNQUFNLFFBQVEsR0FBRyxJQUFJLDhCQUFhLENBQUMsR0FBRyxFQUFFLFdBQVcsRUFBRTtJQUNuRCxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRTtDQUN0QyxDQUFDLENBQUM7QUFFSCxNQUFNLFNBQVMsR0FBRyxJQUFJLG1DQUFlLENBQUMsR0FBRyxFQUFFLGlCQUFpQixFQUFFO0lBQzVELEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFO0lBQ3JDLFVBQVUsRUFBRSxRQUFRLENBQUMsVUFBVTtDQUNoQyxDQUFDLENBQUM7QUFFSCxnRkFBZ0Y7QUFFaEYsSUFBSSx1Q0FBaUIsQ0FBQyxHQUFHLEVBQUUsbUJBQW1CLEVBQUU7SUFDOUMsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUU7SUFDeEMsYUFBYSxFQUFFLFNBQVMsQ0FBQyxhQUFhO0lBQ3RDLG1CQUFtQixFQUFFLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRO0NBQzdELENBQUMsQ0FBQztBQUVILHNEQUFzRDtBQUN0RCwwREFBMEQ7QUFDMUQsTUFBTTtBQUVOLHVEQUF1RDtBQUN2RCwwQkFBMEI7QUFDMUIsTUFBTTtBQUVOLG9DQUFvQztBQUNwQyxxREFBcUQ7QUFDckQsaUNBQWlDO0FBQ2pDLDhDQUE4QztBQUM5Qyw0REFBNEQ7QUFDNUQsUUFBUTtBQUNSLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5pbXBvcnQgJ2RvdGVudi9jb25maWcnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IEhvbWVSZWdpb25TdGFjayB9IGZyb20gJy4uL2xpYi9ob21lLXJlZ2lvbi1zdGFjayc7XG5pbXBvcnQgeyBSZW1vdGVSZWdpb25TdGFja30gZnJvbSAnLi4vbGliL3JlbW90ZS1yZWdpb24tc3RhY2snO1xuaW1wb3J0IHsgRGF0YWJhc2VTdGFjayB9IGZyb20gJy4uL2xpYi9kYXRhYmFzZS1zdGFjayc7XG5cbi8vIGltcG9ydCB7IGFsbEFXU1JlZ2lvbnMgfSBmcm9tICcuLi9jb25zdGFudHMvYXdzLWNvbmZpZ3MnO1xuXG5jb25zdCB7IGFjY291bnQsIEhPTUVfUkVHSU9OIH0gPSAgcHJvY2Vzcy5lbnY7XG5cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuLy8gY29uc3QgZnJvbnRlbmQgPSBuZXcgXG5cbmNvbnN0IGRhdGFiYXNlID0gbmV3IERhdGFiYXNlU3RhY2soYXBwLCAnU2V5bW91ckRCJywgeyBcbiAgZW52OiB7IGFjY291bnQsIHJlZ2lvbjogSE9NRV9SRUdJT04gfVxufSk7XG5cbmNvbnN0IGhvbWVTdGFjayA9IG5ldyBIb21lUmVnaW9uU3RhY2soYXBwLCAnSG9tZVJlZ2lvblN0YWNrJywgeyBcbiAgZW52OiB7IGFjY291bnQsIHJlZ2lvbjogSE9NRV9SRUdJT04gfSxcbiAgcGdJbnN0YW5jZTogZGF0YWJhc2UucGdJbnN0YW5jZSxcbn0pO1xuXG4vLyBjb25zdCByZW1vdGVSZWdpb25zID0gYWxsQVdTUmVnaW9ucy5maWx0ZXIocmVnaW9uID0+IHJlZ2lvbiAhPT0gSE9NRV9SRUdJT04pO1xuXG5uZXcgUmVtb3RlUmVnaW9uU3RhY2soYXBwLCAnUmVtb3RlUmVnaW9uU3RhY2snLCB7XG4gIGVudjogeyBhY2NvdW50LCByZWdpb246ICdjYS1jZW50cmFsLTEnIH0sIFxuICB0ZXN0TXNnRmFuT3V0OiBob21lU3RhY2sudGVzdE1zZ0Zhbk91dCxcbiAgcmVzdWx0Q29sbGVjdG9yUVVybDogaG9tZVN0YWNrLnRlc3RSZXN1bHRDb2xsZWN0b3JRLnF1ZXVlVXJsLFxufSk7XG5cbi8vIG5ldyBjZGsuQ2ZuT3V0cHV0KGRhdGFiYXNlLCAncG9zdGdyZXNEYkVuZHBvaW50Jywge1xuLy8gICB2YWx1ZTogZGF0YWJhc2UucGdJbnN0YW5jZS5pbnN0YW5jZUVuZHBvaW50Lmhvc3RuYW1lLFxuLy8gfSk7XG5cbi8vIG5ldyBjZGsuQ2ZuT3V0cHV0KGhvbWVTdGFjaywgJ3Bvc3RncmVzRGJFbmRwb2ludCcsIHtcbi8vICAgdmFsdWU6IGhvbWVTdGFjay5lbnYsXG4vLyB9KTtcblxuLy8gcmVtb3RlUmVnaW9ucy5mb3JFYWNoKHJlZ2lvbiA9PiB7XG4vLyAgIG5ldyBSZW1vdGVSZWdpb25TdGFjayhhcHAsICdSZW1vdGVSZWdpb25TdGFjaycsIFxuLy8gICB7IGVudjogeyBhY2NvdW50LCByZWdpb24gfSwgXG4vLyAgICAgdGVzdE1zZ0Zhbk91dDogaG9tZVN0YWNrLnRlc3RNc2dGYW5PdXQsXG4vLyAgICAgdGVzdFJlc3VsdENvbGxlY3RvclE6IGhvbWVTdGFjay50ZXN0UmVzdWx0Q29sbGVjdG9yUSxcbi8vICAgfSk7XG4vLyB9KTtcblxuIl19