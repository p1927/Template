//require('dotenv').load();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var app = express();


var helmet = require('helmet');

require('./app_api/models/db');
require('./app_api/config/passport');

var user_api=require('./app_api/routes/user_api');
var company_api=require('./app_api/routes/company_api');
var job_api=require('./app_api/routes/job_api');
//var routeschatapi=require('./app_api/routes/chatroutes_api');




/*var app = express();*/
app.use(helmet());
// view engine setup


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));


app.use(passport.initialize());


app.use('/api/companies',company_api);
app.use('/api/jobs',job_api);
app.use('/api/users',user_api);
//app.use('/chatapi',routeschatapi);

// error handlers
// Catch unauthorised errors
app.use(function (err, req, res, next) {
if (err.name === 'UnauthorizedError') {
res.status(401);
res.json({"message" : err.name + ": " + err.message});
}
});

app.use(function(req, res) {
res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});



module.exports = app;
