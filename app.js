'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config/config');
var baucis = require('baucis');
var swagger = require('baucis-swagger');
var controllers = require('./controllers');
var routes=require('./routes')(controllers);
var passport=require('./config/passport');
var cors = require('cors');//para permitir solicitudes desde cualquier puerto
var app = express();
// config express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api',cors());
app.use('/api',baucis());


app.set('jwt-key',config.key_secret);

// Connect to mongodb
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(config.db, options);
};
connect();
mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);
//config passport
//Server listen at port:3000
var server = app.listen(config.port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
