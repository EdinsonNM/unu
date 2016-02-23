var model = require('../models/CompromisoPagoModel.js');
var Service = require('../commons/libs/compromisopago');

var auth = require('../config/passport');

module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Compromisopago');
      controller.fragment('/compromisopagos');
      //compromisopagos/methods/generar/alumno
      controller.post('methods/generar/:tipo',function(req,res){
        var periodo = req.body._periodo;
        Service.generar(req.params.tipo,periodo,function(err,data){
          if(err) return res.status(err.status).send(err);
          return res.status(201).send(data);
        });

      });

    }
  };
};
