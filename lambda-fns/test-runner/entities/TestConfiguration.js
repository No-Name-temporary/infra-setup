class TestConfiguration {
  constructor({
    title, httpRequest,
  }) {
    this.title = title;
    this.method = httpRequest.method;
    this.url = httpRequest.url;
    this.body = httpRequest.body;
    this.assertions = httpRequest.assertions;
  }

  checkAssertions(response) {
    const results = [];
    let targetValue;
    let actualValue;
    let comparisonType;
    let success;

    const assertionTypes = Object.keys(this.assertions);
    for (let i = 0; i < assertionTypes.length; i += 1) {
      const assertionType = assertionTypes[i];
      switch (assertionType) {
        case 'statusCode':
          targetValue = this.assertions[assertionType].target;
          actualValue = response.status;
          comparisonType = this.assertions[assertionType].comparison;

          success = TestConfiguration.checkResTimeOrStatusCode({
            targetValue, actualValue, comparisonType,
          });
          results.push({
            assertionType, targetValue, actualValue, comparisonType, success,
          });

          break;
        case 'responseTime':
          targetValue = this.assertions[assertionType].target;
          actualValue = response.headers['request-duration'];
          comparisonType = this.assertions[assertionType].comparison;

          success = TestConfiguration.checkResTimeOrStatusCode({
            targetValue, actualValue, comparisonType,
          });
          results.push({
            assertionType, targetValue, actualValue, comparisonType, success,
          });

          break;
        default:
          results.push({
            assertionType,
            targetValue: this.assertions[assertionType],
            actualValue: null,
            success: null,
            error: 'Unrecognized assertion type',
          });
      }
    }
    return results;
  }

  static checkResTimeOrStatusCode({ targetValue, actualValue, comparisonType }) {
    let result;

    switch (comparisonType) {
      case 'less_than':
        actualValue = Number(actualValue);
        result = actualValue < targetValue;
        break;
      case 'greater_than':
        actualValue = Number(actualValue);
        result = actualValue > targetValue;
        break;
      case 'not_equal_to':
        actualValue = String(actualValue);
        result = actualValue !== targetValue;
        break;
      case 'equal_to':
        actualValue = String(actualValue);
        result = actualValue === targetValue;
        break;
      default:
        result = false;
    }
    return result;
  }
}

module.exports = TestConfiguration;
