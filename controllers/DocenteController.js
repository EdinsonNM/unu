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
        res.send(enumValues);
      });
      controller.get('/model/condiciones', function(req, res, next){
        var enumValues = model.schema.path('condicion').enumValues;
        res.send(enumValues);
      });


      controller.query('post', function (request, response, next) {
        if(request._usuario){
          //TODO verificar exitencia de usuario, si existe devolver error 400: BAD REQUEST message: Usuario ya existe
          var usuario = new Usuario(request._usuario);
          Grupo.findOne({codigo:'ALUMNO'},function(grupoErr, objGrupo){
            if(grupoErr) next(grupoErr);

            Usuario.findOne({username: usuario.username}, function(usuarioErr, objUsuario){
              console.log(objUsuario);
              if(usuarioErr){next(usuarioErr);}

              if(objUsuario){
                return response.status(412).send("El usuario ya existe");
              }else{
                console.log("El usuario no existe, entonces lo guardamos");
                usuario._grupo =objGrupo._id;
                console.log("Ahora guardaremos al puto usuario");
                usuario.save(function(error, data){
                  console.log("dentro de save");
                  if(error) return response.status(500).send(error);
                  request._usuario = data;
                  next();
                });
              }
            });
          });
        }else{
          return response.status(500).send("No se ha enviado el usuario");
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
