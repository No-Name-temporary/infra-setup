class TestResult {
  constructor({ title, results }) {
    this.testName = title;
    this.addKeyToAssertionResults(results);
  }

  // for constant time lookup of assertion types
  addKeyToAssertionResults(results) {
    if (results) {
      const assertionResults = {};
      results.forEach((result) => {
        assertionResults[result.assertionType] = result;
      });
      this.assertionResults = assertionResults;
    }
  }
}

module.exports = TestResult;
