module.exports = function(config){
  var express = require('express');
  var bodyParser = require('body-parser');
  var baucis = require('baucis');
  var swagger = require('baucis-swagger');
  var cors = require('cors');//para permitir solicitudes desde cualquier puerto
  var app = express();
  var routes=require('./routes')();
  //require('./controllers/FacultadController.js')().setup();
  // config express
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());
  app.use('/api',baucis());
  app.get('/hello',function(req,res){
    return res.send("HOLA");

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
