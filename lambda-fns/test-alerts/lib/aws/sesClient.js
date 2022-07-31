const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({ region: 'us-east-1' });
const sesClient = new AWS.SES({ apiVersion: '2010-12-01' });

module.exports = {
  sesClient,
};
