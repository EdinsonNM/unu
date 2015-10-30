'use strict';
var mongoose = require('mongoose');
var config = require('./config/config');
var passport=require('./config/passport');
var app = require('./expressjs')(config);
Error.stackTraceLimit = 0; // disables it



// Connect to mongodb
var connect = function connect() {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(config.db, options);
};
connect();
mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);
