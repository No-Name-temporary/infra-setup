const { dbQuery } = require('./db_conn');

async function getRegionByAWSName({ awsRegionName }) {
  const query = `
    SELECT * 
    FROM regions
    WHERE aws_name = $1
  `;
  const result = await dbQuery(query, awsRegionName);
  return result.rows[0];
}

async function insertTestRunData({
  testId,
  success,
  regionId,
  responseStatus,
  responseTime,
  responseBody,
  responseHeaders,
}) {
  const query = `
    INSERT INTO test_runs (test_id, success, started_at, completed_at, region_id, response_status, response_time, response_body, response_headers)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id
  `;

  const now = new Date();
  const result = await dbQuery(
    query,
    testId,
    success,
    now,
    now,
    regionId,
    responseStatus,
    responseTime,
    responseBody,
    responseHeaders,
  );
  return result;
}

async function insertAssertionResultData({
  testRunId, assertionId, actualValue, success,
}) {
  const query = `
    INSERT INTO assertion_results (test_run_id, assertion_id, actual_value, success)
    VALUES ($1, $2, $3, $4)
    RETURNING id
  `;

  const result = await dbQuery(query, testRunId, assertionId, actualValue, success);
  return result;
}

module.exports = {
  getRegionByAWSName,
  insertTestRunData,
  insertAssertionResultData,
};
