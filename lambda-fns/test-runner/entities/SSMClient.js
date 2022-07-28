import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";


function getSSMParameter(paramString) {
  const ssmClient = new SSMClient({ region: process.env.HOME_REGION });
    
  const run = async () => {
    try {
      const data = await ssmClient.send(new GetParameterCommand(paramString));
      console.log(`Success, ${paramString} parameter retrieved`);
      return data;
    } catch (err) {
      console.log('Error', err);
    }
  };
  run();
}

module.exports = getSSMParameter;