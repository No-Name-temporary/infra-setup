const axios = require('axios');

axios.interceptors.request.use((config) => {
  // eslint-disable-next-line no-param-reassign
  config.headers['request-startTime'] = new Date().getTime();
  return config;
});

axios.interceptors.response.use((response) => {
  const currentTime = new Date().getTime();
  const startTime = response.config.headers['request-startTime'];
  response.headers['request-duration'] = currentTime - startTime;
  return response;
});

class TestRunner {
  constructor(testConfiguration) {
    this.testConfiguration = testConfiguration;
  }

  async run() {
    const response = await this.httpRequest();
    const results = this.testConfiguration.checkAssertions(response);
    return {
      status: response.status,
      data: response.data,
      headers: response.headers,
      results,
    };
  }

  async httpRequest() {
    let response;
    try {
      response = await axios({
        method: this.testConfiguration.method,
        url: this.testConfiguration.url,
        data: this.testConfiguration.body,
      });
    } catch (err) {
      console.log('Axios Produced an Error in "testRunner"', err);
    }
    return response;
  }
}

module.exports = TestRunner;
