var model = require('../models/CompromisoPagoModel.js');
var procExport = require('../commons/libs/compromisopago/procesoSalidaBanco');
var auth = require('../config/passport');
var CompromisoPago = require('../commons/libs/compromisopago/compromisopago');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){

      var controller=baucis.rest('CompromisoPago');
      controller.fragment('/compromisopagos');

      //custom methods
      controller.post('/methods/process',function(req,res){
        var type = req.params.type;
        procExport(function(err,result){
          if(err){ return res.status(500).send(err);}
          res.status(200).send(result);
        });
      });

      controller.post('/methods/generar/:tipo',function(req,res){
        var periodo = req.body._periodo;
        var tipo = req.params.tipo;
        var compromiso = new CompromisoPago(periodo,tipo);
        compromiso.generar(function(err,data){
          if(err) return res.status(err.status).send(err);
          return res.status(201).send(data);
        });

      });

    }
  };
};
