/*
 * @Author: your name
 * @Date: 2020-08-08 09:51:53
 * @LastEditTime: 2020-12-11 22:12:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \node_express\process\app.js
 */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//引入session
var session = require('express-session')
//引入上传对象
var multer = require('multer')
//引入mysql操作
let qhyMysql = require('./qhyMysql')
//上传对象配置
let upload = multer({dest:'./public/upload'})




var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//后台页面
var adminRouter = require('./routes/admin/adminRouter')
//登录与注册路由
var RLRouter = require('./routes/RL/loginRouter')



var app = express();




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//配置session
app.use(session({
  secret:'shmilyayamo',
  resave:true,//强制保存session
  cookie:{
    maxAge:7*24*60*60*1000
  },
  saveUninitialized:true//是否初始化session
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'lib')));




//前台路由
app.use('/', indexRouter);
app.use('/users', usersRouter);


//后台路由
app.use('/admin',adminRouter)


//登录注册
app.use('/rl',RLRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
process.env.PORT = 2000;
module.exports = app;
