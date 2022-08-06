const { sendWebhook } = require('../lib/channels/sendWebhook');

class SlackClient {
  constructor(destination, event) {
    this.destination = destination;
    this.event = event;
    this.jsonBody = this.formatData();
  }

  formatData() {
    const payload = {
      blocks: [{
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*TEST: _${this.event.title}_ REGION: _${this.event.sender}_*`,
        },
      }],
    };

    this.event.results.forEach((result) => {
      if (!result.success) {
        const block = {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `FAILED: Assertion Type: ${result.assertionType}\nTarget: ${result.comparisonType} ${result.targetValue} Actual: ${result.actualValue}
            `,
          },
        };
        payload.blocks.push(block);
      }
    });
    return JSON.stringify(payload);
  }

  async send() {
    const result = await sendWebhook(this.destination, this.jsonBody);
    return result;
  }
}

module.exports = {
  SlackClient,
};
