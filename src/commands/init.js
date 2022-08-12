const {
  seymourLog,
} = require('../utils/logger');

const {
  seymourWelcome,
} = require('../utils/consoleMessages');

const createSeymourApp = async () => {
  seymourLog(seymourWelcome());
};

const init = async () => {
  await createSeymourApp();
};

module.exports = { init };
