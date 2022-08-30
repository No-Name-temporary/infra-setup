const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');
const getSSMParameter = require('./SSMClient');

async function sendMsgToSQS(response, inHomeRegion) {
  const homeRegion = process.env.HOME_REGION;
  const sqsClient = new SQSClient({ region: homeRegion });
  const resultCollectorQUrl = inHomeRegion
    ? process.env.RESULT_Q_URL : await getSSMParameter('resultCollectorQUrl');

  const params = {
    MessageBody: JSON.stringify(response),
    QueueUrl: resultCollectorQUrl,
  };

  console.log('final params --> ', params);

  try {
    const data = await sqsClient.send(new SendMessageCommand(params));
    console.log(`Success, message sent to ${params.QueueUrl}. MessageID:`, data.MessageId);
    return data;
  } catch (err) {
    console.log('Error', err);
  }
}

module.exports = sendMsgToSQS;
