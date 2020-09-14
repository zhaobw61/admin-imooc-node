const express = require('express');
const Result = require('../models/Result');
const { login } = require('../services/user');
const router = express.Router();

router.post('/login', function(req, res){
    let { username, password } = req.body;

    login(username, password).then(user=>{
        if(!user || user.length === 0) {
            new Result('登录失败').fail(res);
        } else {
            new Result('登录成功').success(res);
        }
    })
});

router.get('/info', function(req, res, next){
    res.json('user info...');
});

module.exports = router;
