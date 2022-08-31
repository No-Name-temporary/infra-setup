# About
This respository contains the code for the Test Runner lambda function, a component of the Seymour Active Monitoring solution.

Test Runner receives test configuration data from [Test Route Packager](https://github.com/seymour-active-monitoring/test-route-packager). Test Runner makes a request to the API endpoint indicated by the test configuration and then compares the respose to the assertions.

Test Runner communicates results data to the home region for further processing by [Test Result Writer](https://github.com/seymour-active-monitoring/test-result-writer) 

# Deployment

Test Runner should be deployed along with the entire Seymour application. Refer to the following repo for detailed deployment instructions: [infra-setup](https://github.com/seymour-active-monitoring/infra-setup)