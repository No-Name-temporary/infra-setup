# Welcome to the CDK project to deploy the NoName infrastructure on AWS

In order to deploy the project to your AWS account you will need to have the 
following prerequisites.

* AWS CLI installed and configured
* AWS CDK Toolkit installed
* TypeScript
* 

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests

* `cdk bootstrap`   tells AWS to prep all necessary environments for deploy
* `cdk synth`       emits the synthesized CloudFormation template
* `cdk diff`        compare deployed stack with current state
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk destroy`     destroy the infrastructure that was setup with this stack

* `--hotswap`       flag to deploy ONLY changed infra, NOT for production
* `--require-approval never` flag to automatically accept all questions
* `--all`           flag to apply command to ALL stacks

