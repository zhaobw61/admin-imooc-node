const mysql = require('mysql');
const config = require('./index');
const { debug } = require('../utils/constant');
const { isObject } = require('../utils');

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

function querySql(sql) {
    const conn = connect();
    // debug && console.log(sql);
    return new Promise((resolve, reject)=>{
        try {
            conn.query(sql, (err, results) => {
                if (err) {
                    // debug && console.log("查询失败，原因：" + JSON.stringify(err));
                    reject(err);
                } else {
                    // debug && console.log("查询成功，原因：" + JSON.stringify(results));
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

function queryOne(sql) {
    const conn = connect();
    debug && console.log(sql);
    return new Promise((resolve, reject)=>{
        try {
            conn.query(sql, (err, results) => {
                if (err) {
                    debug && console.log("查询失败，原因：" + JSON.stringify(err));
                    reject(err);
                } else {
                    debug && console.log("查询成功，原因：" + JSON.stringify(results));
                    if(results && results.length > 0) {
                        resolve(results[0]);
                    } else {
                        resolve(null);
                    }
                }
            })
        } catch (e) {
            reject(e)
        } finally {
            conn.end();
        }
    })
}

function insert(model, tableName) {
    return new Promise((resolve, reject) => {
        if (!isObject(model)) {
            reject(new Error('插入数据库失败，插入数据非对象'));
        } else { 
            const keys = [];
            const values = [];
            Object.keys(model).forEach(key => {
                if (model.hasOwnProperty(key)) {
                    keys.push(`\`${key}\``);
                    values.push(`'${model[key]}'`);
                }
            });
            if(keys.length > 0 && values.length > 0) {
                let sql = `INSERT INTO \`${tableName}\` (`;
                const keyString = keys.join(',');
                const valuesString = values.join(',');
                sql = `${sql}${keyString}) VALUES (${valuesString})`;
                console.log('sql', sql);
                const conn = connect();
                try {
                    conn.query(sql, (err, result) => {
                        if(err) {
                            reject(err);
                        } else {
                            resolve(resolve);
                        }
                    })
                } catch (e) {
                    reject(e);
                } finally {
                    conn.end();
                }
            } else {
                reject(new Error('插入数据库失败 对象不合法'));
            }
        }
    });
}

function update(model, tableName, where) {
    return new Promise((resolve, reject) => {
        if (!usObject(model)) {
            reject(new Error('插入数据库失败，插入数据非对象'));
        } else {
            const entry = [];
            Object.keys(model).forEach(key => {
                if(model.hasOwnProperty(key)) {
                    entry.push(`\`${key}\`='${model[key]}'`);
                }
            })
            // if (entry.length > 0) {
            //     let sql = `UPDATE \`${tableName}\`SET` = `${sql} ${entry.join(',')} ${where}`;
            //     const conn = connect();
            //     try {
            //         conn.query(sql, (err, result) => {
            //             if(err) {
            //                 reject(err);
            //             } else {
            //                 resolve(result);
            //             }
            //         })
            //     } catch (e) {
            //         reject(e);
            //     }

            // }
        }
    })
}

module.exports = {
    querySql,
    queryOne,
    insert,
    update
}