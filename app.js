'use strict';
var throng = require('throng');
var WORKERS = process.env.WEB_CONCURRENCY || 2;
throng(start, {
  workers: WORKERS,
  lifetime: Infinity
});

function start(){
  'use strict';

  var mongoose = require('mongoose');
  var config = require('./config/config');
  var passport=require('./config/passport');
  var app = require('./expressjs')(config);
  //Error.stackTraceLimit = 0; // disables it
  var path = require('path');
  var watch = require('./watch');
  watch.watchBanco(path.join(__dirname,'/commons/data/imports'));


  // Connect to mongodb
  var connect = function connect() {
    var options = { server: { socketOptions: { keepAlive: 1 } } };
    mongoose.connect(config.db, options);
  };
  connect();
  mongoose.connection.on('error', console.log);
  mongoose.connection.on('disconnected', connect);
}
