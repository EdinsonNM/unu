
var Matricula = require('../models/MatriculaModel.js');
var CompromisoPagoAlumno = require('../commons/libs/compromisopago/Compromisopagoalumno.js');

module.exports=function(){

  Matricula.find({estado:'Prematricula'},function(err,matricula){
    if(err) console.log({message:'Error interno del servidor',detail:err,status:500});
    if(!matricula)  console.log({message:'Matricula no encontrada',detail:null,status:404});

    matricula.forEach(function(item){
      var compromiso = new CompromisoPagoAlumno(item._id);
      compromiso.generar(function(err,data){
          if(err) console.log('Error: ',item._id , err);
          console.log('Correcto: ',item._id);
      });
    });
  });

};
