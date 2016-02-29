var model = require('../models/MatriculaModel.js');
module.exports = function() {
  var baucis = require('baucis');
  return {
    setup: function() {
      var controller = baucis.rest('Matricula');
      controller.relations(true);
      controller.hints(true);
      controller.fragment('/matriculas');

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

    }
  };
};