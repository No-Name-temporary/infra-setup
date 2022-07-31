# About
Contains code and libraries for test-alerts Lambda

# Run locally
1. `$ npm run locally`

For more info: https://stackoverflow.com/questions/52019039/how-to-test-aws-lambda-handler-locally-using-nodejs

# Upload to AWS
1. Zip the contents of the root directory: 
  * `$ cd test-alerts`
  * `$ npm run zip`
2. Upload the .zip file to the AWS Lambda management console

# Expecting Shape of Incoming Test Results Message to be:
```json
{
  "title": "tim-db-test",
  "sender": "us-west-1",
  "timestamp": "Wed, 20 Jul 2022 17:54:22 GMT",
  "results": [
    {
      "assertionType": "statusCode",
      "targetValue": "200",
      "actualValue": "200",
      "comparisonType": "equal_to",
      "success": true
    }
  ]
}
```
