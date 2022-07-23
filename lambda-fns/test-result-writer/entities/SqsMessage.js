class SqsMessage {
  constructor(sqsEvent) {
    this.rawEvent = sqsEvent;
    this.parseAndExtractMessage();
    this.extractRegion();
  }

  parseAndExtractMessage() {
    this.message = JSON.parse(this.rawEvent.Records[0].body);
  }

  extractRegion() {
    this.awsRegion = this.message.sender;
  }
}

module.exports = SqsMessage;
