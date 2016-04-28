var compromisopago = require('../models/CompromisoPagoModel');
var ingresantes = require('./data/ingresantes/ing.js');
var proceso = require('./libs/compromisopago/procesoEntradaBanco');

module.exports = function(){
  for (var i = 0; i < ingresantes.length; i++) {
    var codigo = '00'+ ingresantes[i].DNI.toString();
    compromisopago.findOne({codigo: codigo },function(err,compromiso){
      if(err) return console.error("Ocurrio un error codigo: "+codigo);
      if(!compromiso) return console.warn('No se encontro compromisopago con código ');
      if(!compromiso.pagado){
        proceso.procesarPagoIndividual(compromiso._id,ingresantes[i].MONTO,ingresantes[i].FECHA,function(err){
          if(err) return console.error();(err);
          console.log("se genero alumno con codigo: "+codigo);
        });
      }else{
         console.warn('Compromiso ya se encuentra pagado: '+ codigo);
      }

    });
  }
};





/*var utils = require('compromisopago/procesoEntradaBanco');
load("data/ing.js");
var conn = new Mongo()
var db = conn.getDB("unu-testing");
print('connected to ', db.getName());

var ingresante={};
var ingresantes=ingresantes.RECORDS;

for (var i = 0; i < ingresantes.length; i++) {
    var compromiso=db.compromisopagos.findOne({codigo:'00'+ingresantes[i].DNI.toString()});
    if(compromiso){
      var idcompromiso=compromiso._id;
      if(compromiso.pagado===true){
        print( i + ' : Registro Pagado');
      }else{
          procesarPagoIndividual(idcompromiso,ingresantes[i].MONTO,ingresantes[i].FECHA);
      }
    }else{
      print( i + 'NO' );
    }
}
*/
