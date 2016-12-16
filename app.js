const express = require('express');
const app = express();

/**
 * middleware
 */
const path = require('path');
const bodyParser = require('body-parser');

app.set('port', process.env.PORT || 8080);
app.use(express.static(path.join(__dirname, 'public'))); //静态文件目录
//app.use(favicon(__dirname + '/htdocs/img/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * Template engine
 */
const dustjs = require('adaro');
// 注册
app.engine("dust",dustjs.dust({ cache: false }));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'dust');

/**
 * logger
 */
const logger = require('morgan');

app.use(logger('dev'));
// 当有错误发生时，就将错误信息保存到了根目录下的 error.log 文件夹里。
app.use(logger({stream: accessLog}));
var fs = require('fs');
var accessLog = fs.createWriteStream('access.log', {flags: 'a'});
var errorLog = fs.createWriteStream('error.log', {flags: 'a'});
app.use(function (err, req, res, next) {
  var meta = '[' + new Date() + '] ' + req.url + '\n';
  errorLog.write(meta + err.stack + '\n');
  next();
});

/**
 * routes
 */
const routes = require('./routes.js');
routes(app);

//捕获404错误，并转发到错误处理器。
app.use(function(req, res, next) {
    //res.statusCode = "404";
    res.render('404');
});
/**
 * socket.io
 */
const server = require('http').Server(app);
const io = require('socket.io')(server);
require('./socket/index.js')(io);

/**
 * Start app
 */
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});