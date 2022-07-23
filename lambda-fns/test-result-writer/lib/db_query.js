const { dbQuery } = require('./db_conn');

async function getTestByName({ testName }) {
  const query = `
    SELECT * 
    FROM tests
    WHERE name = $1
  `;
  const result = await dbQuery(query, testName);
  return result.rows[0];
}

async function getRegionByAWSName({ awsRegionName }) {
  const query = `
    SELECT * 
    FROM regions
    WHERE aws_name = $1
  `;
  const result = await dbQuery(query, awsRegionName);
  return result.rows[0];
}

async function getAssertionsByTestId({ testId }) {
  const query = `
  SELECT * 
  FROM assertions
  WHERE test_id = $1
`;
  const result = await dbQuery(query, testId);
  return result.rows;
}

async function insertTestRunData({ testId, regionId }) {
  const query = `
    INSERT INTO test_runs (test_id, started_at, completed_at, region_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id
  `;

  const now = new Date();
  const result = await dbQuery(query, testId, now, now, regionId);
  return result;
}

async function insertAssertionResultData({
  testRunId, assertionId, actualValue, pass,
}) {
  const query = `
    INSERT INTO assertion_results (test_run_id, assertion_id, actual_value, pass)
    VALUES ($1, $2, $3, $4)
    RETURNING id
  `;

  const result = await dbQuery(query, testRunId, assertionId, actualValue, pass);
  return result;
}

module.exports = {
  getTestByName,
  getRegionByAWSName,
  getAssertionsByTestId,
  insertTestRunData,
  insertAssertionResultData,
};
