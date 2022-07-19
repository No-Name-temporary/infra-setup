#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ProvisionAwsStack } from '../lib/provision-aws-stack';

const app = new cdk.App();
new ProvisionAwsStack(app, 'ProvisionAwsStack');
