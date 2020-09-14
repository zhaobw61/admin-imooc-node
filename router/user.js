const express = require('express');
const Result = require('../models/Result');
const { querySql } = require('../db/config');
const router = express.Router();

router.post('/login', function(req, res){
    console.log(req.body);
    let { username, password } = req.body;
    querySql('select * from admin_user').then(results => {
        console.log('results');
        console.log(results);
    });
    if(username === 'admin' && password === '111111') {
        new Result('登录成功').success(res);
    } else {
        new Result('登录失败').fail(res);
    }
});

router.get('/info', function(req, res, next){
    res.json('user info...');
});

module.exports = router;
