import 'dotenv/config';
const AWS = require('aws-sdk');

const { accessKeyId, secretAccessKey, 
  routePackagerFuncUrl, frontendBucketName, } = process.env;

const s3 = new AWS.S3({ accessKeyId, secretAccessKey });

exports.handler = async (event, context, callback) => {
  const s3Bucket = frontendBucketName; 
  const objectName = 'config.json';
  const objectData = `{ "testRoutePackagerUrl" : "${routePackagerFuncUrl}" }`;
  const objectType = 'application/json';
  try {
    const params = {
       Bucket: s3Bucket,
       Key: objectName,
       Body: objectData,
       ContentType: objectType,
    };
    const result = await s3.putObject(params).promise();
    console.log(`File uploaded successfully at https:/` + s3Bucket +   `.s3.amazonaws.com/` + objectName);
  } catch (error) {
    console.log('error');
  }
};