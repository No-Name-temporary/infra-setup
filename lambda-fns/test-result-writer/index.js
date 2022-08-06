const SqsMessage = require('./entities/SqsMessage');
const TestResult = require('./entities/TestResult');
const {
  getRegionByAWSName,
  insertTestRunData,
  insertAssertionResultData,
} = require('./lib/db_query');
require('dotenv').config();
const { failedTestScreener } = require('./lib/failedTestScreener');
const { invokeTestAlerts } = require('./lib/aws/lambdaActions');

exports.handler = async (event) => {
  const sqsMessage = new SqsMessage(event);
  console.log('sqsMessage.message -->', sqsMessage.message);
  const testResult = new TestResult(sqsMessage.message);
  const failedTests = failedTestScreener(sqsMessage.message.results);

  console.log('Failed Assertions Present? ', failedTests);

  if (failedTests) {
    try {
      invokeTestAlerts(sqsMessage.message);
    } catch (e) {
      console.error(`invocation of test-alerts lambda threw an error: ${e.message}. Continuing with DB operation...`);
    }
  }

  const regionMetadata = await getRegionByAWSName({ awsRegionName: sqsMessage.awsRegion });
  const testRunsResult = await insertTestRunData({
    testId: testResult.testId,
    success: !failedTests,
    regionId: regionMetadata.id,
    responseStatus: testResult.responseStatus,
    responseTime: testResult.responseTime,
    responseBody: JSON.stringify(testResult.responseBody),
    responseHeaders: JSON.stringify(testResult.responseHeaders),
  });

  const testRunId = testRunsResult.rows[0].id;

  testResult.results.forEach((result) => {
    insertAssertionResultData({
      testRunId,
      assertionId: result.assertionId,
      actualValue: result.actualValue,
      success: result.success,
    });
  });

  return 'success';
};
