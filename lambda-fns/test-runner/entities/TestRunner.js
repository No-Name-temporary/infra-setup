/* eslint-disable no-param-reassign */
const axios = require('axios');

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
    axios.interceptors.request.use((config) => {
      config.headers['request-startTime'] = new Date().getTime();

      // set user-defined request headers
      if (this.testConfiguration.headers) {
        const reqHeaders = this.testConfiguration.headers;
        Object.keys(reqHeaders).forEach((header) => {
          config.headers[header] = reqHeaders[header];
        });
      }

      return config;
    });

    axios.interceptors.response.use((response) => {
      const currentTime = new Date().getTime();
      const startTime = response.config.headers['request-startTime'];
      response.headers['request-duration'] = currentTime - startTime;
      return response;
    });

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
