
var Matricula = require('../models/MatriculaModel.js');
var CompromisoPago=require('../models/CompromisoPagoModel.js');
var CompromisoPagoAlumno = require('../commons/libs/compromisopago/compromisopagoalumno.js');

module.exports=function(){
  console.log('recalculo..');
  CompromisoPago.remove({pagado:false},function(err,data){
    //console.log(err,data);
    if(err) return false;
    Matricula.find({estado:'Prematricula'}).populate('_alumno').exec(function(err,matricula){
      if(err) console.log({message:'Error interno del servidor',detail:err,status:500});
      if(!matricula)  console.log({message:'Matriculas no encontradas',detail:null,status:404});

      matricula.forEach(function(item){

        var compromiso = new CompromisoPagoAlumno(item._id);
        compromiso.generarCompromisoRecalculo(function(err,data){
            if(err) console.log('Error: ',item._id , err);
            console.log('Correcto: ',item._id);
        });
      });
    });
  });

};
