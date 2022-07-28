const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');
const getSSMParameter = require('./SSMClient');

async function sendMsgToSQS(response) {
  const sqsClient = new SQSClient({ region: 'us-east-1' });
  const resultCollectorQUrl = await getSSMParameter('resultCollectorQUrl');

  const params = {
    MessageBody: JSON.stringify(response),

    QueueUrl: resultCollectorQUrl,
  };

  console.log('final params --> ', params);

  const run = async () => {
    try {
      const data = await sqsClient.send(new SendMessageCommand(params));
      console.log(`Success, message sent to ${params.QueueUrl}. MessageID:`, data.MessageId);
      return data;
    } catch (err) {
      console.log('Error', err);
    }
  };
  run();
}

module.exports = sendMsgToSQS;
