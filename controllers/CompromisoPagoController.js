var model = require('../models/CompromisoPagoModel.js');
var procExport = require('../commons/libs/compromisopago/procesoSalidaBanco');
var auth = require('../config/passport');

module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){

      var controller=baucis.rest('CompromisoPago');
      controller.fragment('/compromisopagos');

      //custom methods
      controller.post('/methods/process/:type',function(req,res){
        var type = req.params.type;
        switch (type) {
        case 'export':
            procExport(function(err,result){
              if(err){ return res.status(500).send(err);}
              res.status(200).send(result);
            });
            break;
          case 'import':
            /*RegistroPagos.CargaArchivo(function(err,result){
              if(err){ return res.status(500).send(err);}
              res.status(200).send(result);
            });*/
            break;
          default:
            res.status(404).send();
        }
      });

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
