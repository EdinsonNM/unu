var model = require('../models/GrupoModel.js');
var Q = require('q');
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
              order:0,
              title:'Admisión',
              description:'Realiza el mantenimiento de las tablas generales del sistema',
              url:'',
              flex:'33',
              children:[
                {title:'Ingresantes',icon:'',url:'app.ingresantes',order:1},
                {title:'Aprobación Ingresantes',icon:'',url:'app.aprobacioningresantes',order:1},
                {title:'Pagos Ingresantes',icon:'',url:'app.pagosingresantes',order:1}
              ],
              style:{
                color: 'white',
                bgColor:'bgc-white',
                bgColorHead:'bgc-teal-500',
                image:'bghome-1.jpg'
              }
            },
            {
              order:1,
              title:'Mantenimiento',
              description:'Realiza el mantenimiento de las tablas generales del sistema',
              url:'',
              flex:'67',
              children:[
                {title:'Facultad',icon:'fa-institution',url:'app.facultad',order:1},
                {title:'Parametros',icon:'fa-cogs',url:'app.parametros',order:2},
                {title:'Procesos',icon:'fa-cogs',url:'app.procesos',order:3},
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
              flex:33,
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
                {title:'Equivalencias',icon:'',url:'app.planestudiosequivalencia',order:3},
                {title:'Aprobación Plan de Estudios',icon:'',url:'app.aprobacionplanestudios',order:4},
                {title:'Aprobación Cursos Periodo',icon:'',url:'app.aprobacioncursosperiodo',order:5},
                {title:'Reportes',icon:'',url:'app.paramprocesosescuela',order:6},

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
              flex:100,
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

    }
  };
};
