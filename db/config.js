const mysql = require('mysql');
const config = require('./index');
const { debug } = require('../utils/constant');

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
    debug && console.log(sql);
    return new Promise((resolve, reject)=>{
        try {
            conn.query(sql, (err, results) => {
                debug && console.log("查询失败，原因：" + JSON.stringify(err));
                if (err) {
                    reject(err);
                } else {
                    debug && console.log("查询失败，原因：" + JSON.stringify(results));
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