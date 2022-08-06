const { sesClient } = require('../aws/sesClient');
require('dotenv').config();

async function sendSES(emailAddress, results) {
  let sendSesResult;
  const params = {
    Destination: {
      ToAddresses: [
        emailAddress,
      ],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `${results}`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'API TEST FAILED!',
      },
    },
    Source: process.env.MAIL_USER,
  };

  try {
    sendSesResult = await sesClient.sendEmail(params).promise();
  } catch (e) {
    console.error('SEND SES ERROR:', e);
  }
  return sendSesResult;
}

module.exports = {
  sendSES,
};
