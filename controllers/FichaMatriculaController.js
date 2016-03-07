var model = require('../models/FichaMatriculaModel.js');
var CursoAperturado = require('../models/CursoAperturadoPeriodoModel.js');
var Alumno = require('../models/AlumnoModel.js');
var Curso = require('../models/CursoModel.js');

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
        .exec(function(err,matricula){
          if(err || !matricula) return res.status(500).send('No se encontró la matrícula');
          CursoAperturado.find({_periodo:_periodo})
          .populate('_grupos')
          .populate(
            [{
              path:'_grupos',
              populate: {
                path: '_seccion',
                model: 'Seccion'
              }
            },{
              path: '_planestudiodetalle',
              populate: {
                path: '_curso',
                model: 'Curso'
              }
            }])
          .exec(function(err,aperturados){
            if(err || !aperturados) return res.status(500).send('No se encontraron Cursos Aperturados');
            var count;
            aperturados.forEach(function(aperturado){
              if(aperturado._planestudiodetalle){
                count = 0;
                matricula._detalles.forEach(function(detalle){
                  if(detalle._planEstudiosDetalle === aperturado._planestudiodetalle._id){
                    count++;
                  }
                });
                if(count === 0 && planesRegistrados.indexOf(aperturado._planestudiodetalle._id) < 0 && aperturado._grupos.length>0){
                  cursosDisponibles.push(aperturado);
                  planesRegistrados.push(aperturado._planestudiodetalle._id);
                }
              }
            });
            return res.status(200).send(cursosDisponibles);
          });
        });

      });

    }
  };
};
