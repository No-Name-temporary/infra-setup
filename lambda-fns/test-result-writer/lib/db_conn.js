const pg = require("pg");
require('dotenv').config();

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PW,
  port: process.env.DB_PORT || 5432,
})

const logQuery = (statement, parameters) => {
  let timeStamp = new Date();
  let formattedTimeStamp = timeStamp.toString().substring(4, 24);
  console.log(formattedTimeStamp, statement, parameters);
};

module.exports = {
  dbQuery(statement, ...parameters) {
    logQuery(statement, parameters);
    return pool.query(statement, parameters)
      .then(res => res)
      .catch(err => console.error('Error executing query', err.stack))
  }
};
