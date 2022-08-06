class TestResult {
  constructor({
    testId, title, responseStatus, responseBody, responseHeaders, results,
  }) {
    this.testId = testId;
    this.testName = title;
    this.responseStatus = responseStatus;
    this.responseTime = responseHeaders['request-duration'];
    this.responseBody = responseBody;
    this.responseHeaders = responseHeaders;
    this.results = results;
  }
}

module.exports = TestResult;
