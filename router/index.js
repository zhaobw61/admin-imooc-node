const express = require('express');
const boom = require('boom');
const userRouter = require('./user');
const {
    CODE_ERROR
} = require('../utils/constant');

// 注册路由

const router = express.Router();

router.get('/', function(req, res){
    res.send('welcome to JJ book');
})

router.use('/user', userRouter);

router.use((req, res, next)=>{
    next(boom.notFound('接口不存在'));
});

/**
 * 自定义路由异常处理中间件
 * 注意两点：
 * 第一，方法的参数不能减少
 * 第二，方法的必须放在路由最后
 */
router.use((err, req, res, next) => {
    console.log(err)
    if (err.name && err.name === 'UnauthorizedError') {
        const {
            status = 401, message
        } = err
        new Result(null, 'Token验证失败', {
            error: status,
            errMsg: message
        }).jwtError(res.status(status))
    } else {
        const msg = (err && err.message) || '系统错误'
        const statusCode = (err.output && err.output.statusCode) || 500;
        const errorMsg = (err.output && err.output.payload && err.output.payload.error) || err.message
        new Result(null, msg, {
            error: statusCode,
            errorMsg
        }).fail(res.status(statusCode))
    }
})

module.exports = router;