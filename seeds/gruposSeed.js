var model = require('../models/GrupoModel.js');
model.remove({}, function(err) {
   console.log('grupos removed');
   var grupo1=new model({nombre:'Administrador',codigo:'ADMIN', menu:[]});
   grupo1.save(function(error,data){console.log('created grupo...');});

   var grupo2=new model({nombre:'Jefe de Departamento',codigo:'JEFE_DPTO'});
   grupo2.save(function(error,data){console.log('created grupo...');});

   var grupo3=new model({nombre:'Docente',codigo:'DOCENTE'});
   grupo3.save(function(error,data){console.log('created grupo...');});

   var grupo4=new model({nombre:'Alumno',codigo:'ALUMNO'});
   grupo4.save(function(error,data){console.log('created grupo...');});

   var grupo5=new model({nombre:'Módulo de Investigación Científica',codigo:'MIC'});
   grupo5.save(function(error,data){console.log('created grupo...');});

});
