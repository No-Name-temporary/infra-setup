var exec = require('child_process').exec;

const {
  seymourLog,
} = require('../utils/logger');

const {
  seymourWelcome,
} = require('../utils/consoleMessages');

const cdkBootstrap = async () => {
  await 
  seymourLog(seymourWelcome());
  const cdkBootstrap = exec('cdk bootstrap');
  cdkBootstrap.stdout.on('data', function(data) {
    console.log(data); 
});

};

const init = async () => {
  await cdkBootstrap();
};

module.exports = { init };
