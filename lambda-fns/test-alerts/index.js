const { EmailClient } = require('./entities/EmailClient');
const { SlackClient } = require('./entities/SlackClient');
const { DiscordClient } = require('./entities/DiscordClient');
const { getAlertInfo } = require('./lib/db/db_query');

exports.handler = async (event) => {
  const alertChannels = await getAlertInfo(event.title);
  const targets = [];

  alertChannels.forEach((target) => {
    switch (target.type) {
      case 'email':
        targets.push(new EmailClient(target.destination, event));
        break;
      case 'slack':
        targets.push(new SlackClient(target.destination, event));
        break;
      case 'discord':
        targets.push(new DiscordClient(target.destination, event));
        break;
      default:
        console.log('Unrecognized channel type: ', target.type);
    }
  });

  const results = await Promise.allSettled(targets.map((target) => target.send()));
  console.log('Notification Results: ', results);
};
