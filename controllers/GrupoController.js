var model = require('../models/GrupoModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Grupo');
      controller.fragment('/grupos');

      controller.put('/seed/data/updateMenu', function(req, res, next){
        model.findOne({codigo: 'ADMIN'}, function(error, grupo){
          grupo.menu = [
            {
              order:1,
              title:'Mantenimiento',
              description:'Realiza el mantenimiento de las tablas generales del sistema',
              url:'',
              flex:33,
              children:[
                {title:'Facultad',icon:'fa-institution',url:'app.facultad',order:1},
                {title:'Parametros',icon:'fa-cogs',url:'app.parametros',order:2},
                {title:'Procesos',icon:'fa-cogs',url:'app.procesos',order:3},
                {title:'Plan de Estudios',icon:'fa-books',url:'app.planestudios',order:4},
                {title:'Cursos',icon:'',url:'app.cursos',order:5},
                {title:'Pabellones',icon:'',url:'app.pabellones',order:6},
                {title:'Docentes',icon:'',url:'app.docentes',order:7},
                {title:'Aulas',icon:'',url:'app.aulas',order:8},
                {title:'Alumnos',icon:'',url:'app.alumnos',order:9},
                {title:'Ingresantes',icon:'',url:'app.ingresantes',order:10}
              ],
              style:{
                color: 'white',
                bgColor:'bgc-white',
                bgColorHead:'bgc-teal-500',
                image:'bghome-1.jpg'
              }
            },
            {
              order:2,
              title: 'Apertura',
              description:'Inicia el proceso de Apertura del Periodo Académico',
              url:'',
              flex:67,
              children:[
                {title:'Periodos',icon:'',url:'app.periodos',order:1},
                {title:'Parametros y Procesos por Periodo',icon:'',url:'app.paramprocesosperiodo',order:2},
                {title:'Parametros y Procesos por Escuela',icon:'',url:'app.paramprocesosescuela',order:2},

              ],
              style:{
                color: 'white',
                bgColor:'bgc-white',
                bgColorHead:'bgc-teal-500',
                image:'bghome-2.jpg'
              }
            },
            {
              order:3,
              title: 'Plan de Estudios',
              description:'',
              url:'',
              flex:33,
              children:[
                {title:'Cursos',icon:'',url:'app.cursos',order:1},
                {title:'Plan de Estudios',icon:'',url:'app.planestudios',order:2},
                {title:'Equivalencias',icon:'',url:'app.paramprocesosperiodo',order:3},
                {title:'Reportes',icon:'',url:'app.paramprocesosescuela',order:4},

              ],
              style:{
                color: 'white',
                bgColor:'bgc-white',
                bgColorHead:'bgc-teal-500',
                image:'bghome-1.jpg'
              }
            },
            {
              order:4,
              title: 'Aprobación',
              url:'',
              flex:33,
              children:[
                {title:'Alumnos Ingresantes',icon:'',url:'app.aprobacioningresantes',order:1},
                {title:'Plan de Estudios',icon:'',url:'app.aprobacionplanestudios',order:2}
              ],
              style:{
                color: 'white',
                bgColor:'bgc-white',
                bgColorHead:'bgc-teal-500',
                image:'bghome-2.jpg'
              }
            },
            {
              order:5,
              title: 'Programación Académica',
              url:'',
              flex:33,
              children:[
                {title:'Asignar Aulas',icon:'',url:'app.asignaraulas',order:1},
              ],
              style:{
                color: 'white',
                bgColor:'bgc-white',
                bgColorHead:'bgc-teal-500',
                image:'bghome-3.jpg'
              }
            }

          ];
          grupo.save(function(error, data){
            //res.status(200).send(data);
          });
        });

        model.findOne({codigo: 'MIC'}, function(error, grupo){
          grupo.menu = [
            {
              order:1,
              title:'Asignaturas',
              url:'app.mic_asignaturas',
            },
            {
              order:2,
              title: 'Revisión Plan de Estudios',
              url:'app.mic_revisionplanestudios'
            },
            {
              order:3,
              title: 'Registro de Silabus',
              url:'app.mic_silabus'
            },
            {
              order:4,
              title: 'Reportes',
              url:'app.mic_revision'
            }

          ];
          grupo.save(function(error, data){
            res.status(200).send(data);
          });
        });
      });

      controller.post('/seed/data', function(req,res,next){
        model.remove({}, function(err) {
           console.log('grupo removed');
        });

        var grupo1=new model({
          nombre:'Administrador',
          codigo:'ADMIN',
          menu:[]
        });

        grupo1.save();
        var grupo2=new model({nombre:'Jefe de Departamento',codigo:'JEFE_DPTO'});
        grupo2.save();
        var grupo3=new model({nombre:'Docente',codigo:'DOCENTE'});
        grupo3.save();
        var grupo4=new model({nombre:'Alumno',codigo:'ALUMNO'});
        grupo4.save();
        var grupo5=new model({nombre:'Módulo de Investigación Científica',codigo:'MIC'});
        grupo5.save();

        res.send({ok:'ok'});
        next();
      });
    }
  };
};
