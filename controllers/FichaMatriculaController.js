var model = require('../models/FichaMatriculaModel.js');
var CursoAperturado = require('../models/CursoAperturadoPeriodoModel.js');
var Alumno = require('../models/AlumnoModel.js');
var Curso = require('../models/CursoModel.js');
var Matricula = require('../models/MatriculaModel.js');
var Programaciones = require('../models/ProgramacionGrupoCursoModel.js');
var _ = require('underscore');

var auth = require('../config/passport');

module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('FichaMatricula');
      controller.fragment('/fichamatriculas');

      //custom methods

      /**
       * retorna los detalles de la matrícula
       */
      controller.get('/methods/fichamatriculadetalle', function(req, res){
        var _periodo = req.query._periodo;
        var _alumno = req.query._alumno;
        model.findOne({_periodo:_periodo,_alumno:_alumno}).exec(function(err,matricula){
          if(err || !matricula) return res.status(500).send('No se encontró la matrícula');
          return res.status(200).send(matricula);
        });
      });

      /**
       * retorna los cursos habilitados para la matrícula
       */
      var groupByCiclo = function(cursosDisponibles){
        var cursosCiclo = {};
        cursosDisponibles.forEach(function(curso){
          var ciclo = curso._planestudiodetalle.ciclo;
          if(typeof cursosCiclo[ciclo] === 'undefined'){
            cursosCiclo[ciclo] = [];
          }
          cursosCiclo[ciclo].push(curso);
        });
        return cursosCiclo;
      };
      var findAperturadoEnMatricula = function(cursosMatriculados, aperturado){
        var c= 0;
        var res= [];
        cursosMatriculados.forEach(function(item){
          if(item._grupoCurso._cursoAperturadoPeriodo._planestudiodetalle.toString() == aperturado._planestudiodetalle._id.toString()){
            res.push(item._grupoCurso._id.toString());
          }
        });
        return res;
      };
      controller.get('/methods/fichamatricula', function(req, res){
        var cursosDisponibles = [];
        var planesRegistrados = [];
        var _periodo = req.query._periodo;
        var _alumno = req.query._alumno;
        model.findOne({_periodo:_periodo,_alumno:_alumno})
        .populate(
          [{
            path:'_detalles'
          }]
        )
        .exec(function(err,fichamatricula){
          if(err || !fichamatricula) return res.status(500).send('No se encontró la fichamatrícula');
          CursoAperturado.find({_periodo:_periodo})
          .populate(
            [{
              path:'_grupos',
              populate: [{
                path: '_seccion',
                model: 'Seccion'
              },{
                path: '_programaciones',
                model: 'ProgramacionGrupoCurso'
              }]
            },{
              path: '_planestudiodetalle',
              populate: {
                path: '_curso',
                model: 'Curso'
              }
            }])
          .exec(function(err,aperturados){
            if(err || !aperturados.length) return res.status(500).send('No se encontraron Cursos Aperturados');

            Matricula.findOne({'_alumno':_alumno, '_periodo':_periodo})
            .populate(
              [{
                path: '_detalleMatricula',
                populate: {
                  path: '_grupoCurso',
                  model: 'GrupoCurso',
                  populate: {
                    path: '_cursoAperturadoPeriodo',
                    model: 'CursoAperturadoPeriodo'
                  }
                }
              }]
            ).exec(function(err, matricula){
              if(err || !matricula) return res.status(500).send('No se encontró la matrícula');

              var count;
              var cursosMatriculados = matricula._detalleMatricula;
              var cursosFiltrados = [];
              aperturados.forEach(function(aperturado){
                cursosFiltrados = findAperturadoEnMatricula(cursosMatriculados, aperturado);
                if(cursosFiltrados.length){
                  aperturado._grupos.forEach(function(grupo, key){
                    if(cursosFiltrados.indexOf(grupo._id.toString())<0 && grupo.inscritos >= grupo.totalCupos){
                      aperturado._grupos.splice(key, 1);
                    }
                  });
                  if(aperturado._grupos.length>0){
                    cursosDisponibles.push(aperturado);
                    planesRegistrados.push(aperturado._planestudiodetalle._id);
                  }
                }else{
                  if(aperturado._planestudiodetalle){
                    count = 0;
                    fichamatricula._detalles.forEach(function(detalle){
                      if(detalle._planEstudiosDetalle === aperturado._planestudiodetalle._id){
                        count++;
                      }
                    });
                    if(count === 0 && planesRegistrados.indexOf(aperturado._planestudiodetalle._id) < 0){
                      aperturado._grupos.forEach(function(grupo, key){
                        if(grupo.inscritos >= grupo.totalCupos){
                          aperturado._grupos.splice(key, 1);
                        }
                      });
                      if(aperturado._grupos.length>0){
                        cursosDisponibles.push(aperturado);
                        planesRegistrados.push(aperturado._planestudiodetalle._id);
                      }
                    }
                  }
                }
              });
              var response = {};
              response.ciclos = groupByCiclo(cursosDisponibles);
              return res.status(200).send(response);
            });
          });
        });

      });

    }
  };
};
