var model = require('../models/DetalleMatriculaModel.js');
var Parent = require('../models/MatriculaModel.js');
var auth = require('../config/passport');

module.exports = function() {
  var baucis = require('baucis');
  return {
    setup: function() {
      var controller = baucis.rest('DetalleMatricula');
      controller.relations(true);
      controller.hints(true);
      controller.fragment('/detallematriculas');

      controller.query('post', function(req, res, next){
        req.baucis.query.populate(
          [{
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
        );
        next();
      });

      controller.request(auth.ensureAuthenticated);

      controller.request(function (request, response, next) {
        if (request.isAuthenticated) return next();
        return response.send(401);
      });

      /**
       * actualiza el _detalleMatricula en MatriculaModel despues de crear el detalle matricula
       */
      controller.request('post', function (request, response, next) {
        model.findOne({_matricula:request.body._matricula,_grupoCurso:request.body._grupoCurso},function(err,data){
          if(err) return response.status(500).send({message:'Ocurrio un error interno del sistema',detail:err});
          if(data) return response.status(200).send(data);
          next();
        });

        request.baucis.outgoing(function (context, callback) {
          Parent.update({
            _id: context.doc._matricula
          },{
            $push: {
              _detalleMatricula: context.doc
            }
          },
          function(err){
             if(err) return response.status(500).send({message:err});
             callback(null, context);
          });
        });
      });

      /**
       * elimina el
       */
       controller.request('delete', function (request, response, next) {
         next();
         model.findById(request.params.id, function (err, detalle){
           var detalles = [];
           detalles.push(detalle._id );
           Parent.update({
             _id: detalle._matricula
           },{
             $pull: {
               '_detalleMatricula':  {
                 $in:detalles
               }
             }
           },{
             safe: true
           },
          function(err, obj){
            if(err) return response.status(500).send({message:err});
            next();
          });
        });

      });

    }
  };
};
