const mysql = require('mysql');
const config = require('./index');

function connect() {
    return mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        insecureAuth : true,
        multipleStatements: true
    })
}

function querySql(sql){
    const conn = connect();
    return new Promise((resolve, reject)=>{
        try {
            conn.query(sql, (err, results) => {
                console.log('err', err);
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })
        } catch (e) {
            reject(e)
        } finally {
            conn.end();
        }
    })
}

module.exports = {
    querySql
}