module.exports = function(config){
  var express = require('express');
  var bodyParser = require('body-parser');
  var baucis = require('baucis');
  var swagger = require('baucis-swagger');
  var path    = require("path");
  var cors = require('cors');//para permitir solicitudes desde cualquier puerto
  var app = express();
  var routes=require('./routes')();
  var staticFolder = 'client/app/';

  // config express
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());
  app.use('/api',baucis());
  app.use(express.static(staticFolder));
  app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/'+staticFolder+'/index.html'));
  });
  app.set('jwt-key',config.key_secret);

  //Server listen at port:3000
  var server = app.listen(config.port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
  });

  return app;
};
