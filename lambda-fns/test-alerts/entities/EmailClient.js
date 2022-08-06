const { sendSES } = require('../lib/channels/sendSES');

class EmailClient {
  constructor(destination, event) {
    this.destination = destination;
    this.event = event;
    this.messageBody = this.formatData();
  }

  formatData() {
    let output = `<p>TEST: <strong>${this.event.title}</strong><br> REGION: <strong>${this.event.sender}</strong></p>\n`;

    this.event.results.forEach((result) => {
      if (!result.success) {
        const string = `FAILED: Assertion Type: ${result.assertionType}\nTarget: ${result.comparisonType} ${result.targetValue}\nActual: ${result.actualValue}\n<br>`;
        output += string;
      }
    });
    return `<p>${output}</p>`;
  }

  async send() {
    const result = await sendSES(this.destination, this.messageBody);
    return result;
  }
}

module.exports = {
  EmailClient,
};
