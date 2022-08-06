const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.MAIL_CLIENT_ID,
  process.env.MAIL_CLIENT_SECRET,
  process.env.MAIL_REDIRECT_URI,
);

oAuth2Client.setCredentials({ refresh_token: process.env.MAIL_REFRESH_TOKEN });

async function sendMail(emailAddress, results) {
  let result;
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USER,
        clientId: process.env.MAIL_CLIENT_ID,
        clientSecret: process.env.MAIL_CLIENT_SECRET,
        refreshToken: process.env.MAIL_REFRESH_TOKEN,
        accessToken,
      },
    });

    const mailOptions = {
      from: `Team Not Special <${process.env.MAIL_USER}>`,
      to: `${emailAddress}`,
      subject: 'API TEST FAILED!',
      html: results,
    };

    result = await transport.sendMail(mailOptions);
  } catch (err) {
    console.error(err);
  }
  return result;
}

module.exports = {
  sendMail,
};
