const { lambdaClient, InvokeCommand } = require('./lambdaClient');

const invokeTestAlerts = (results) => {
  const params = {
    FunctionName: process.env.TEST_ALERT_LAMBDA_NAME,
    InvocationType: 'Event',
    Payload: JSON.stringify(results),
  };
  const command = new InvokeCommand(params);
  lambdaClient.send(command);
};

module.exports = {
  invokeTestAlerts,
};
