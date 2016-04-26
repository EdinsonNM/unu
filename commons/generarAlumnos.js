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
