const { SSMClient, GetParameterCommand } = require('@aws-sdk/client-ssm');


async function getSSMParameter(paramString) {
  const ssmClient = new SSMClient({ region: process.env.HOME_REGION });
    
  try {
    const { Parameter } = await ssmClient.send(new GetParameterCommand({ Name: paramString }));
    console.log(`Success, ${paramString} parameter retrieved, the value is: `, Parameter);
    return Parameter.Value;
  } catch (err) {
    console.log('Error', err);
  }
}

module.exports = getSSMParameter;