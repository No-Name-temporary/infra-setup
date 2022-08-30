# About
This respository contains the code for the Test Result Writer lambda function, a component of the Seymour Active Monitoring solution.

Test Result Writer receives test results data from [Test Runner](https://github.com/seymour-active-monitoring/test-runner) and writes to the database. For failed tests, Test Result Writer triggers [Test Alerts](https://github.com/seymour-active-monitoring/test-alerts)

# Deployment

Test Result Writer should be deployed along with the entire Seymour application. Refer to the following repo for detailed deployment instructions: [infra-setup](https://github.com/seymour-active-monitoring/infra-setup)