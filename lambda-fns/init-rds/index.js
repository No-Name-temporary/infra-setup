const pg = require("pg");
const fs = require('fs')
const path = require('path')


exports.handler = async (e) => {
  try {
    const { config } = e.params
    const [ host, port, user, password, database ] = [ 
      config.host, config.dbPort, config.username, config.password, config.dbName  
    ];
       
    const pool = new pg.Pool({ host, port, user, password, database });

    const dbClient = await pool.connect();

    const sqlScript = fs.readFileSync(path.join(__dirname, 'script.sql'), "utf8");
    
    const res = await dbClient.query(sqlScript);
    await dbClient.end()

    return {
      status: 'OK',
      results: res
    }
  } catch (err) {
    return {
      status: 'ERROR',
      err,
      message: err.message
    }
  }
}
