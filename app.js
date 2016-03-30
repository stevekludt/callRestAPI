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
// Raw Data
var apiKey = 'R7zvLASyVJWDpUar9cRbssx2k8rylSzSHw6LAGhh';
var username = 'skludt';
var password = '+P582gFW6Np366^7b';
var startDate = '3/24/2011';
var endDate = '3/24/2011';

//Aggregated Data

var options = {
    host : 'developer.nrel.gov',
    path : '/api/pvdaq/v3/site_data.json?api_key=' + apiKey +
            '&system_id=2&start_date=' + startDate +
            '&end_date=' + endDate +
            '&aggregate=hourly',
    port: 443,
    headers: {
        authorization : 'Basic ' + new Buffer(username + ':' + password).toString('base64')
    }
};
var readings = [];
request = https.get(options, function(res) {
    res.on('data', function(data) {
        var jsonData = JSON.parse(data);
        var headings = jsonData.outputs[0];
        var numOfReadings = jsonData.outputs.length;


        for (var i = 1; i < numOfReadings; i++) {
            // for each of the elements I need to map them to a proper JSON Object
            var object = jsonData.outputs[i];
            //loop trough each object element and pair with same placed value of headings
            // and put it in readings
            var element = {};
            for (var x = 0; x < object.length; x++) {
                var name = headings[x];
                var value = object[x];
                element[name] = (value);
            }
            // here is where I need to call Event Hub to pass in a single JSON object
            console.log(JSON.stringify(element));

            //create a JSON object with all the data collected
            readings.push(element);

        }
        //console.log(readings)

    });
    res.on('end', function() {
        // do something at the end of the read...
        console.log(JSON.stringify(readings))
    });
    res.on('error', function(e) {
        console.log("Got Error: " + e.message)
    });
});


/*
 var options = {
 host : 'developer.nrel.gov',
 path : '/api/pvdaq/v3/data.json?api_key=' + apiKey +
 '&system_id=3&start_date=' + startDate +
 '&end_date=' + endDate,
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
 */

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
