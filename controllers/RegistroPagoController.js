var model = require('../models/RegistroPagoModel.js');
var RegistroPagos = require('./libs/RegistroPagos');
var auth = require('../config/passport');

module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('RegistroPago');
      controller.fragment('/registropagos');




      //custom methods
      controller.post('/methods/generate/:type',function(req,res){
        var periodo = req.body._periodo;
        var type = req.params.type;//all,ingresantes,alumnos
        switch (type) {
        case 'todos':
            RegistroPagos.Todos();
            break;
          case 'ingresantes':
            RegistroPagos.Ingresantes(periodo,function(error,archivo){
                if(error) return res.status(error.status).send(error);
                return res.status(202).send(archivo);
            });
            break;
          case 'alumnos':
            RegistroPagos.Alumnos(periodo,function(error,archivo){
              if(error) return res.status(error.status).send(error);
                return res.status(202).send(archivo);
            });
            break;
          default:
            res.status(404).send();
        }
      });

    }
  };
};
