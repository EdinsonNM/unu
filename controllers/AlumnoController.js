var model = require('../models/AlumnoModel.js');
var Persona = require('../models/PersonaModel.js');
var Usuario = require('../models/UsuarioModel.js');
var Grupo = require('../models/GrupoModel.js');
var Q = require('q');

module.exports = function() {
  var baucis = require('baucis');
  return {
    setup: function() {
      var controller = baucis.rest('Alumno');
      controller.fragment('/alumnos');

      //custom methods
      controller.get('/model/sexo', function(req, res, next){
        var enumValues = model.schema.path('sexo').enumValues;
        res.status(200).send(enumValues);
      });
      controller.get('/model/estadoCivil', function(req, res, next){
        var enumValues = model.schema.path('estadoCivil').enumValues;
        res.status(200).send(enumValues);
      });
      controller.request('post', function (request, response, next) {
        Q.fcall(function(){
          var defer = Q.defer();
          Grupo.findOne({codigo:'ALUMNO'}).exec(function(err,data){
            if(err) return defer.reject({status:500,err:err});
            if(!data) return  defer.reject({status:500,err:"No se encontro el grupo correspondiente al usuario"});
            defer.resolve(data);

          });
          return defer.promise;
        })
        .then(function(grupo){
          var defer = Q.defer();

          Usuario.findOne({username: request.body._usuario.username}, function(err, usuario){
            if(err) return defer.reject({status:500,err:err});
            if(usuario) return defer.reject({status:412,message:'Usuario ya existe'});
            usuario = new Usuario(request.body._usuario);
            usuario._grupo = grupo._id;
            usuario.save(function(err,usuario){
              if(err) return defer.reject({status:500,err:err});
              defer.resolve(usuario);
            });
          });

          return defer.promise;
        },function(err){
          response.status(err.status).send(err);
        })
        .then(function(usuario){
          var defer = Q.defer();
          Persona.findOne({'documento':request.body._persona.documento},function(err,persona){
            var defer = Q.defer();
            if(err) return defer.reject({status:500,err:err});
            if(!persona) persona = new Persona(request.body._persona);
            persona.save(function(err,per){
              if(err) return defer.reject({status:500,err:err});
              defer.resolve({usuario:usuario,persona:per});
            });
          });
          return defer.promise;
        },function(err){
          response.status(err.status).send(err);
        })
        .then(function(data){
          request.body._usuario = data.usuario._id;
          request.body._persona = data.persona._id;
          next();
        },function(err){
          response.status(err.status).send();
        });
        /*if(request.body._usuario){
          //TODO verificar exitencia de usuario, si existe devolver error 400: BAD REQUEST message: Usuario ya existe
          Grupo.findOne({codigo:'ALUMNO'},function(grupoErr, objGrupo){
            if(grupoErr) next(grupoErr);
            var usuario = new Usuario(request.body._usuario);
            var persona = new Persona(request.body._persona);
            console.log(persona);
            usuario._grupo = objGrupo._id;
            usuario.email = request.body._persona.email;
            Usuario.findOne({username: usuario.username}, function(usuarioErr, objUsuario){
              if(usuarioErr) return next(usuarioErr);
              if(objUsuario) return response.status(412).send({message:"El usuario ya existe"});

              usuario.save(function(error, data){
                if(error) return response.status(500).send(error);
                request.body._usuario = data._id;

                persona.save(function(error, data){
                    console.log(data);
                    request.body._persona = data._id;
                });
                next();
              });
            });
          });
        }else{
          return response.status(500).send({message:"No se ha enviado el usuario"});
        }*/
      });

      controller.get('/methods/paginate', function(req, res) {
        var limit = parseInt(req.query.count);
        var page = parseInt(req.query.page) || 1;
        var filter = req.query.filter;
        for (var key in filter) {
          switch (key) {
            case 'codigo':
            case 'nombres':
            case 'apellidos':
              filter[key] = new RegExp(filter[key],'i');
              break;
          }
        }
        model.paginate(
          filter, {
            page: page,
            limit: limit,
            populate: [
                '_persona',
                '_periodoIngreso',
                '_facultad',
                '_escuela',
                '_modalidadIngreso',
                '_tipoCondicionAlumno',
                '_situacionAlumno'
            ] //Aqui corregir
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
