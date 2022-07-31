const axios = require('axios');

async function sendWebhook(url, payload) {
  let result;
  try {
    result = await axios({
      method: 'POST',
      url,
      headers: {
        'Content-Type': 'application/json',
      },
      data: payload,
    });
  } catch (e) {
    console.error('AXIOS ERROR: ', e);
  }
  return result;
}

module.exports = {
  sendWebhook,
};
