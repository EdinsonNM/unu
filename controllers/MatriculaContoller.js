var model = require('../models/MatriculaModel.js');
var auth = require('../config/passport');

module.exports = function() {
  var baucis = require('baucis');
  return {
    setup: function() {
      var controller = baucis.rest('Matricula');
      controller.relations(true);
      controller.hints(true);
      controller.fragment('/matriculas');

      controller.request(auth.ensureAuthenticated);

      controller.request(function (request, response, next) {
        if (request.isAuthenticated) return next();
        return response.send(401);
      });


      controller.request('post',function(req,res,next){
          var params = req.body;
          model.findOne({_periodo:params._periodo,_alumno:params._alumno},function(err,data){
            if(err) return res.status(500).send({message:'Ocurrio un error interno del sistema',detail:err});
            if(data) return res.status(200).send(data);
            return next();
          });
      });

      controller.query('get', function(req, res, next){
        req.baucis.query.populate(
          [{
            path: '_detalleMatricula',
            model: 'DetalleMatricula',
            populate: [{
              path: '_grupoCurso',
              model: 'GrupoCurso',
              populate: [{
                path: '_seccion',
                model: 'Seccion'
              },{
                path: '_cursoAperturadoPeriodo',
                model: 'CursoAperturadoPeriodo',
                populate: [{
                  path: '_planestudiodetalle',
                  model: 'Planestudiodetalle',
                  populate: [{
                    path: '_curso',
                    model: 'Curso'
                  }]
                }]
              }]
            }]
          }]
        );
        next();
      });

      /**
       * devuelve el último periodo registradoº
       */
       controller.get('/lastMatricula', function(req, res){
        var alumno = req.query._alumno;
        var periodo = req.query._periodo;
        model.findOne({_periodo: periodo, _alumno: alumno})
        .populate([{
            path: '_detalleMatricula',
            model: 'DetalleMatricula',
            populate: [{
              path: '_grupoCurso',
              model: 'GrupoCurso',
              populate: [{
                path: '_seccion',
                model: 'Seccion'
              },{
                path: '_cursoAperturadoPeriodo',
                model: 'CursoAperturadoPeriodo',
                populate: [{
                  path: '_planestudiodetalle',
                  model: 'Planestudiodetalle',
                  populate: [{
                    path: '_curso',
                    model: 'Curso'
                  }]
                }]
              }]
            }]
         },{
           path: '_planEstudio'
        }])
        .exec(function(err, matricula){
          if(err) return res.status(500).send('No se encontró la matrícula.');
          return res.status(200).send(matricula);
        });
       });

    }
  };
};
