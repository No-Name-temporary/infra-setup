# About
Contains code and libraries for test route packager Lambda

# Run locally
1. `$ npm run locally`

For more info: https://stackoverflow.com/questions/52019039/how-to-test-aws-lambda-handler-locally-using-nodejs

# Upload to AWS
1. Zip the contents of the root directory: 
  * `$ cd test-route-packager`
  * `$ npm run zip`
2. Upload the .zip file to the AWS Lambda management console

# Expecting Shape of Incoming Test Results Message to be:
```json
{
  "test": {
    "title": "My new test",
    "locations": [
      "us-east-1", "ca-central-1"
    ],
    "minutesBetweenRuns": 1,
    "type": "API",
    "httpRequest": {
      "method": "GET",
      "url": "https://example.com/api/endpoint",
      "headers": {},
      "body": {},
      "assertions": {
        "statusCode": {
          "comparison": "equal_to",
          "target": 200
        }
      }
    }
  }
}
```
