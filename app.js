// -- Modules dependencies --//
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var game = require('./routes/game');
var auth = require('./routes/auth');
var app = express();

// Connect to database
const credentials = require('./config/mongo-credentials');
mongoose.connect(credentials.url, (err, client) =>{
  if(err) {
    console.log(err);
  } else {
    console.log("Connection successful");
  }
})



// -- END SECTION --//

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, 'build')));

app.use('/api/game', game);
app.use('/api/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log(err);
  if (req.app.get('env') != 'development') {
    delete err.stack;
  }
  res.status(err.statusCode || 500).json(err);
});

module.exports = app;