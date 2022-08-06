const TestConfiguration = require('./entities/TestConfiguration');
const TestRunner = require('./entities/TestRunner');
const sendMsgToSQS = require('./entities/SQSClient');
const getTimestamp = require('./entities/timestamp');

exports.handler = async (event) => {
  const body = JSON.parse(event.Records[0].body);
  const currRegion = event.Records[0].awsRegion;
  const homeRegion = process.env.HOME_REGION;
  const { test } = JSON.parse(body.Message);
  console.log(`...starting test runner in ${currRegion}...`);
  console.log('SHAPE OF TEST ---> ', test);

  const testConfiguration = new TestConfiguration(test);
  const testRunner = new TestRunner(testConfiguration);

  const {
    status, data, headers, results,
  } = await testRunner.run();

  console.log('SHAPE OF RESULTS ------>', results);

  const response = {
    title: test.title,
    sender: currRegion,
    timestamp: getTimestamp(),
    responseStatus: status,
    responseBody: data,
    responseHeaders: headers,
    results,
  };

  // console.log('currRegion vs homeRegion -->', currRegion, homeRegion)
  // if (currRegion === homeRegion) return response;

  await sendMsgToSQS(response);
};
