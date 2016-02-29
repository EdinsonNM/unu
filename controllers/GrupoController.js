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
              title:'Mantenimiento',
              description:'Realiza el mantenimiento de las tablas generales del sistema',
              url:'',
              flex:'67',
              children:[
                {title:'Facultad',icon:'fa-institution',url:'app.facultad',order:1},
                {title:'Alumnos',icon:'',url:'app.alumnos',order:2}
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
              title:'Admisión',
              description:'Realiza el mantenimiento de las tablas generales del sistema',
              url:'',
              flex:'33',
              children:[
                {title:'Ingresantes',icon:'',url:'app.ingresantes',order:1},
                {title:'Aprobación Ingresantes',icon:'',url:'app.aprobacioningresantes',order:2},
                {title:'Pagos Ingresantes',icon:'',url:'app.pagosingresantes',order:3}
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
              title: 'Planes de Estudio',
              description:'',
              url:'',
              flex:33,
              children:[
                {title:'Cursos',icon:'',url:'app.cursos',order:1},
                {title:'Plan de Estudios',icon:'',url:'app.planestudios',order:2},
                {title:'Equivalencias',icon:'',url:'app.planestudiosequivalencia',order:3},
                {title:'Aprobación Plan de Estudios',icon:'',url:'app.aprobacionplanestudios',order:4},
                {title:'Aprobación Cursos Periodo',icon:'',url:'app.aprobacioncursosperiodo',order:5},
                {title:'Reportes',icon:'',url:'app.',order:6}
              ],
              style:{
                color: 'white',
                bgColor:'bgc-white',
                bgColorHead:'bgc-teal-500',
                image:'bghome-1.jpg'
              }
            },
            {
              order:3,
              title: 'Horario',
              url:'',
              flex:33,
              children:[
                {title:'Pabellones',icon:'',url:'app.pabellones',order:1},
                {title:'Aulas',icon:'',url:'app.aulas',order:2},
                {title:'Secciones',icon:'',url:'app.secciones',order:3},
                {title:'Docentes',icon:'',url:'app.docentes',order:4},
                {title:'Curso - Grupo',icon:'',url:'app.grupocursoperiodo',order:5},
                {title:'Horario',icon:'',url:'app.horarios',order:6},
                {title:'Reportes',icon:'',url:'app.',order:7}
              ],
              style:{
                color: 'white',
                bgColor:'bgc-white',
                bgColorHead:'bgc-teal-500',
                image:'bghome-2.jpg'
              }
            },
            {
              order:4,
              title: 'Apertura',
              description:'Inicia el proceso de Apertura del Periodo Académico',
              url:'',
              flex:33,
              children:[
                {title:'Periodos',icon:'',url:'app.periodos',order:1},
                {title:'Procesos',icon:'fa-cogs',url:'app.procesos',order:2},
                {title:'Parametros',icon:'fa-cogs',url:'app.parametros',order:3},
                {title:'Parametros y Procesos por Periodo',icon:'',url:'app.paramprocesosperiodo',order:4},
                {title:'Parametros y Procesos por Escuela',icon:'',url:'app.paramprocesosescuela',order:5},
                {title:'Generación de ficha de matrícula',icon:'',url:'app.',order:6},
                {title:'Ficha de matrícula individual',icon:'',url:'app.',order:7}
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
              title: 'Matrícula Test',
              description:'Inicia el proceso de matrícula de cada alumno',
              url:'',
              flex:33,
              children:[{
                title:'Matricula',
                icon:'',
                url:'app.matricula',
                order:1
              },{
                title:'Matrícula Revisión',
                icon:'',
                url:'app.matricularevision',
                order:2
              },{
                title:'Matrícula Cursos',
                icon:'',
                url:'app.matriculacursos',
                order:3
              }],
              style:{
                color: 'white',
                bgColor:'bgc-white',
                bgColorHead:'bgc-teal-500',
                image:'bghome-2.jpg'
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

        model.findOne({codigo: 'ALUMNO'}, function(error, grupo){
          grupo.menu = [
            {
              order:5,
              title: 'Matrícula',
              description:'Inicia el proceso de matrícula de cada alumno',
              url:'',
              flex:33,
            //   children:[{
            //     title:'Matricula',
            //     icon:'',
            //     url:'app.matricula',
            //     order:1
            //   },{
            //     title:'Matrícula Revisión',
            //     icon:'',
            //     url:'app.matricularevision',
            //     order:2
            //   },{
            //     title:'Matrícula Incripción',
            //     icon:'',
            //     url:'app.matriculainscripcion',
            //     order:3
            //   }],
              style:{
                color: 'white',
                bgColor:'bgc-white',
                bgColorHead:'bgc-teal-500',
                image:'bghome-2.jpg'
              }
            }

          ];
          grupo.save(function(error, data){
            //res.status(200).send(data);
          });
        });
      });

    }
  };
};
