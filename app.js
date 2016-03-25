var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var https = require('https');


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// my code
var apiKey = 'R7zvLASyVJWDpUar9cRbssx2k8rylSzSHw6LAGhh';
var username = 'skludt';
var password = '+P582gFW6Np366^7b';
var url = 'https://developer.nrel.gov/api/pvdaq/v3/data.json?api_key=' + apiKey +
    '&system_id=2&start_date=3/24/2011&end_date=3/25/2011';

var options = {
    host : 'developer.nrel.gov',
    path : '/api/pvdaq/v3/data.json?api_key=' + apiKey + '&system_id=3&start_date=3/24/2011&end_date=3/25/2011',
    port: 443,
    headers: {
        authorization : 'Basic ' + new Buffer(username + ':' + password).toString('base64')
    }
};

request = https.get(options, function(res) {
    var body = "";
    res.on('data', function(data) {
        body += data;
    });
    res.on('end', function() {
        console.log(body);
    });
    res.on('error', function(e) {
        console.log("Got Error: " + e.message)
    });
});


// end my code

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
