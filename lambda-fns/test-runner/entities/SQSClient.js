const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');

function sendMsgToSQS(response) {
  const sqsClient = new SQSClient({ region: 'us-east-1' });

  const params = {
    MessageBody: JSON.stringify(response),

    QueueUrl: process.env.RESULTS_Q_URL,
  };

  console.log('final params --> ', params);

  // const run = async () => {
  //   try {
  //     const data = await sqsClient.send(new SendMessageCommand(params));
  //     console.log(`Success, message sent to ${params.QueueUrl}. MessageID:`, data.MessageId);
  //     return data;
  //   } catch (err) {
  //     console.log('Error', err);
  //   }
  // };
  // run();
}

module.exports = sendMsgToSQS;
