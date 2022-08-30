# Deploy Seymour
Welcome to the CDK project to deploy the Seymour infrastructure on your AWS account.

## Prerequisites
In order to deploy the project to your account you will need to have met the 
following prerequisites.

* AWS CLI [installed](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html#getting-started-install-instructions) and [configured](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html#getting-started-install-instructions)
* TypeScript 2.7 or later (`npm -g install typescript`)
* AWS CDK Toolkit installed (`npm install -g aws-cdk`)
  [installation docs](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html#:~:text=Here%27s%20what%20you%20need%20to%20install%20to%20use%20the%20AWS%20CDK.)

## Deployment Steps

1. .env file configuration - In the root folder is an example fake.env file with dummy values, input all
necessary information. For example your AWS account number, keys, secrets, etc.
The information for the database can be left alone, but it's probably best
to change them to your own values. Lastly, remove `fake` from the file name in order for it to be used.

1B. [OPTIONAL] - In the env file you configured your "home" AWS region in which most of the resources
  will be deployed. There is currently a "sample" set of remote regions being used in the `~/bin/provision-aws.ts`
  file. Once satisfied that Seymour is working as you expect, you can comment the 'sample' lines of code.
  However, by default, all of the other AWS regions*** will be deployed to as remote regions. 
  If you would like to limit the remote regions, please delete any unneeded regions from the array in the
  `~/constants/aws-configs.ts` file.

  *** - [Not all AWS regions are 'enabled' by default](https://docs.aws.amazon.com/general/latest/gr/rande-manage.html#:~:text=If%20a%20Region%20is%20disabled%20by%20default%2C%20you%20must%20enable%20it%20before%20you%20can%20create%20and%20manage%20resources.), the following regions must be
    manually enabled through your AWS console before being able to deploy to them.
    - Africa (Cape Town)
    - Asia Pacific (Hong Kong)
    - Asia Pacific (Jakarta)
    - Europe (Milan)
    - Middle East (Bahrain)
  They are currently commented out of the imported `allAWSRegions` variable. Once manually activated in your
  console, you can uncomment the regions in the `aws-configs.ts` file and run the installation as outlined.

2. `npm install`

3. `cdk bootstrap` - This is a one time setup to prep your AWS account to allow 
  the deployment of all the resources.

3. `npm run provision` - This command deploys all resources to your AWS account.
  If you make any subsequent changes to the CDK app, this is the only command
  that you will need to run for future deployments.

If you run into errors with the installation process, it is most likely with the AWS
CLI environment. Please confirm that you have both installed and completed the
initial setups steps to interact with the CLI on your local machine.

Also, the HOME_REGION variable in the env file must be the same as the region
you have configured for your AWS CLI environment.

4. To remove all deployed resources from your account run `cdk destroy --all`


## Misc commands
The `cdk.json` file tells the CDK Toolkit how to execute your app.

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

