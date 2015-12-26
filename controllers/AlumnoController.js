var model = require('../models/AlumnoModel.js');
var Usuario = require('../models/UsuarioModel.js');
var Grupo = require('../models/GrupoModel.js');

module.exports = function() {
  var baucis = require('baucis');
  return {
    setup: function() {
      var controller = baucis.rest('Alumno');
      controller.fragment('/alumnos');

      //custom methods
      controller.request('post', function (request, response, next) {
        if(request._usuario){
          //TODO verificar exitencia de usuario, si existe devolver error 400: BAD REQUEST message: Usuario ya existe
          var usuario = new Usuario(request._usuario);
          Grupo.findOne({codigo:'ALUMNO'},function(grupoErr, objGrupo){
            if(grupoErr) next(grupoErr);
            usuario.grupo = objGrupo._id;
            Usuario.findOne({username: usuario.username}, function(usuarioErr, objUsuario){
              console.log(objUsuario);
              if(usuarioErr) return next(usuarioErr);
              if(objUsuario) return response.status(412).send({message:"El usuario ya existe"});

              usuario.save(function(error, data){
                if(error) return response.status(500).send(error);
                request._usuario = data._id;
                next();
              });
            });
          });
        }else{
          return response.status(500).send({message:"No se ha enviado el usuario"});
        }
      });

      controller.get('/methods/paginate', function(req, res) {
        var limit = req.query.count;
        var page = req.query.page || 1;
        var filter = req.query.filter;
        model.paginate(
          filter, {
            page: page,
            limit: limit,
            populate: ['_facultad']
          },
          function(err, results, pageCount, itemCount) {
            var obj = {
              total: itemCount,
              perpage: limit * 1,
              current_page: page * 1,
              last_page: Math.ceil(itemCount / limit),
              from: (page - 1) * pageCount + 1,
              to: page * pageCount,
              data: results
            };
            res.send(obj);
          }
        );
      });

    }
  };
};
