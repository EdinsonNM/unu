var model = require('../models/DocenteModel.js');
var Usuario = require('../models/UsuarioModel.js');
var Grupo = require('../models/GrupoModel.js');

module.exports = function() {
  var baucis = require('baucis');
  return {
    setup: function() {
      var controller = baucis.rest('Docente');
      controller.fragment('/docentes');

      //custom methods
      controller.get('/model/tiposDedicacion', function(req, res, next){
        var enumValues = model.schema.path('tipoDedicacion').enumValues;
        res.status(200).send(enumValues);
      });
      controller.get('/model/condiciones', function(req, res, next){
        var enumValues = model.schema.path('condicion').enumValues;
        res.status(200).send(enumValues);
      });
      controller.get('/model/grados', function(req, res, next){
        var enumValues = model.schema.path('grado').enumValues;
        res.status(200).send(enumValues);
      });
      controller.get('/model/categorias', function(req, res, next){
        var enumValues = model.schema.path('categoria').enumValues;
        res.status(200).send(enumValues);
      });
      controller.request('post', function (request, response, next) {
        if(request.body._usuario){
          Grupo.findOne({codigo:'DOCENTE'},function(grupoErr, objGrupo){
            if(grupoErr) return next(grupoErr);
            var usuario = new Usuario(request.body._usuario);
            usuario._grupo = objGrupo._id;
            Usuario.findOne({username: usuario.username}, function(usuarioErr, objUsuario){
              if(usuarioErr) return next(usuarioErr);
              if(objUsuario) return response.status(412).send({message:"El usuario ya existe"});

              usuario.save(function(error, data){
                if(error) return response.status(500).send(error);
                request.body._usuario = data._id;
                next();
              });

            });
          });
        }else{
          return response.status(500).send({message:"No se ha enviado el usuario"});
        }

      });

      controller.get('/methods/paginate', function(req, res) {
        var limit = parseInt(req.query.count);
        var page = parseInt(req.query.page) || 1;
        var filter = req.query.filter;
        model.paginate(
          filter, {
            page: page,
            limit: limit,
            populate: ['_facultad']
          },
          function(err, results) {
            var obj = {
              total: results.total,
              perpage: limit*1,
              current_page: page*1,
              last_page: results.pages,
              from: (page-1)*limit+1,
              to: page*limit,
              data: results.docs
            };
            res.send(obj);
          }
        );
      });

    }
  };
};
