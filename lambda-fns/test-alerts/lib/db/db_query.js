const { dbQuery } = require('./db_conn');

async function getAlertInfo(testTitle) {
  const query = `
    SELECT t.id AS test_id, a.type, a.destination
    FROM tests as t
    INNER JOIN tests_alerts as ta
        on ta.test_id = t.id
    INNER JOIN alerts as a
        on a.id = ta.alerts_id
    WHERE t.name = $1
  `;
  const result = await dbQuery(query, testTitle);
  return result.rows;
}

module.exports = {
  getAlertInfo,
};
