# About
Contains code and libraries for test results writer Lambda

# Run locally
1. `$ npm run locally`

For more info: https://stackoverflow.com/questions/52019039/how-to-test-aws-lambda-handler-locally-using-nodejs

# Upload to AWS
1. Zip the contents of the root directory: 
  * `$ cd test-result-writer`
  * `$ npm run zip`
2. Upload the .zip file to the AWS Lambda management console

# Expecting Shape of Incoming Test Results Message to be:
```json
{
  "title": "example-working-test",
  "sender": "us-west-1",
  "timestamp": "Sat, 16 Jul 2022 13:43:07 GMT",
  "results": [
    {
      "assertionType": "statusCode",
      "targetValue": "200",
      "actualValue": 200,
      "comparisonType": "equal_to",
      "success": true
    }
  ]
}
```