const { querySql, queryOne } = require('../db/config');

function login(username, password){
    return querySql(`select * from admin_user where username='${username}' and password='${password}'`);
}

function findeUser(username){
    return queryOne(`select id, username, nickname, role, avatar from admin_user where username='${username}'`);
}

module.exports = {
    login,
    findeUser
}