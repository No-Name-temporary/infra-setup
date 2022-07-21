# testRunner-\[region\]

This is the lambda code to be used for each test runner region.

# Run locally
1. `$ cd test-runner-us-west-1`
2. `$ npm run locally`

For more info: https://stackoverflow.com/questions/52019039/how-to-test-aws-lambda-handler-locally-using-nodejs

# Upload to AWS
1. Zip the contents of the root directory: 
  * `$ cd test-runner-us-west-1`
  * `$ npm run zip`
2. Upload the test-runner.zip file to each region yuo would like in the AWS Lambda management console.

## 
The replacement property in the package.json file to have the directory name used as the name for the output zip file is:
```json
"zip": "zip -r ${PWD##*/}.zip .",`
```