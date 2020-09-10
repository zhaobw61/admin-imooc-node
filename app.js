const express = require('express');
const router = require('./router');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use('/', router);

const SSLPORT = 18082;

const server = app.listen(SSLPORT, function(){
    console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT)

});

// const fs = require('fs')
// const https = require('https')

// const privateKey = fs.readFileSync('https/book_youbaobao_xyz.key', 'utf8')
// const certificate = fs.readFileSync('https/book_youbaobao_xyz.pem', 'utf8')
// const credentials = { key: privateKey, cert: certificate }
// const httpsServer = https.createServer(credentials, app)
// const SSLPORT = 18082
// httpsServer.listen(SSLPORT, function() {
//   console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT)
// })