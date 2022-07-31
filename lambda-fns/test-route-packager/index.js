// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const getMessageAttributes = require('./getMessageAttributes');

exports.handler = function (event) {
  console.log('...starting test-route-packager with payload --> ', event);

	if (!event.test) {
		event = JSON.parse(event.body);
	}

  const region = process.env.AWS_REGION;
  AWS.config.update({ region });

  // Create publish parameters
  const params = {
    Message: JSON.stringify(event), /* required */
    TopicArn: process.env.TOPIC_ARN,
  };

  params.MessageAttributes = getMessageAttributes(event.test.locations);

  console.log('params --> ', params);

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
