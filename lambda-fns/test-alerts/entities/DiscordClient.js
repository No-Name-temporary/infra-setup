const { sendWebhook } = require('../lib/channels/sendWebhook');

class DiscordClient {
  constructor(destination, event) {
    this.destination = destination;
    this.event = event;
    this.jsonBody = this.formatData();
  }

  formatData() {
    const payload = {
      content: `TEST: ${this.event.title} REGION: ${this.event.sender}`,
      embeds: [{
        fields: [],
      }],
    };

    this.event.results.forEach((result) => {
      if (!result.success) {
        const field = {
          name: `FAILED: Assertion Type: ${result.assertionType}`,
          value: `Target: ${result.comparisonType} ${result.targetValue} Actual: ${result.actualValue}`,
        };
        payload.embeds[0].fields.push(field);
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
  DiscordClient,
};
