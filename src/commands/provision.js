var exec = require('child_process').exec;

const awsProvision = async () => {
  const awsProvision = exec('npm run provision');
  awsProvision.stdout.on('data', function(data) {
    console.log(data); 
});

};

const provision = async () => {
  await awsProvision();
};

module.exports = { provision };
