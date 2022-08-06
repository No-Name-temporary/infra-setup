const failedTestScreener = (results) => results.filter((result) => !result.success).length > 0;

module.exports = {
  failedTestScreener,
};
