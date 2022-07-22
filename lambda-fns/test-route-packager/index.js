// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const getMessageAttributes = require('./getMessageAttributes');

exports.handler = function (event) {
  console.log('...starting test-route-packager with payload --> ', event);

  const region = 'us-east-1';
  AWS.config.update({ region });

  // Create publish parameters
  const params = {
    Message: JSON.stringify(event), /* required */
    TopicArn: 'arn:aws:sns:us-east-1:082057163641:test-msg-fan-out',
  };

  params.MessageAttributes = getMessageAttributes(event.test.locations);

  // Create promise and SNS service object
  const publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();

  // Handle promise's fulfilled/rejected states
  publishTextPromise.then(
    (data) => {
      console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
      // console.log("MessageID is " + data.MessageId);
    },
  ).catch(
    (err) => {
      console.error(err, err.stack);
    },
  );
};
