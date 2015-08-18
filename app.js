var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

//var memcache = require('memcache');
//var client = new memcache.Client(11211, 'localhost');
//client.connect();

var mysql      = require('mysql');
var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : '',
      database : 'kg'
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
      console.log("Voice Data : " + req.query.vol);
      var post  = {stick_id: req.query.id, vol: req.query.vol, threshold: req.query.threshold};
      connection.query('INSERT INTO voices SET ?', post, function(err, rows, fields) {
            if (err) throw err;
              console.log(rows[0]);
      });

      /**
      client.set(req.query.id, req.query.vol, function(error, result){
      }, 3600);
      **/
      
      res.json('hello world');
});

app.get('/get', function(req, res) {
      connection.query('SELECT * FROM `voices` WHERE `stick_id` = ? order by id desc limit 1 ', [req.query.id], function(err, rows, fields) {
            if (err) throw err;
            console.log(rows[0]);
      });
      /**
      client.get(req.query.id, function(error, result){
        res.send(result);
      }, 3600);
      **/
      res.json(row[0]);
});


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
