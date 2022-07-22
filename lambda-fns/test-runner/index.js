const TestConfiguration = require('./entities/TestConfiguration');
const TestRunner = require('./entities/TestRunner');
const sendMsgToSQS = require('./entities/SQSClient');
const getTimestamp = require('./entities/timestamp');

exports.handler = async (event) => {
  const body = JSON.parse(event.Records[0].body);
  const currRegion = event.Records[0].awsRegion;
  const { test } = JSON.parse(body.Message);

  console.log(`...starting test runner in ${currRegion}...`);
  console.log('SHAPE OF TEST ---> ', test);

  const testConfiguration = new TestConfiguration(test);
  const testRunner = new TestRunner(testConfiguration);

  const results = await testRunner.run();
  const response = {
    title: test.title,
    sender: currRegion,
    timestamp: getTimestamp(),
    results,
  };

  sendMsgToSQS(response);
};
