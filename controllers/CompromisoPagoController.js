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
    }
  };
};
