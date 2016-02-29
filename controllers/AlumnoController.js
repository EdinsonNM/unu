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
      controller.query('get', function(req, res, next){
        req.baucis.query.populate(
          [{
            path: '_persona',
            model: 'Persona'
          },{
            path: '_avanceCurricular',
            model: 'AvanceCurricular'
          }]
        );
        next();
      });
      controller.get('/model/sexo', function(req, res, next){
        var enumValues = model.schema.path('sexo').enumValues;
        res.status(200).send(enumValues);
      });
      controller.get('/model/estadoCivil', function(req, res, next){
        var enumValues = model.schema.path('estadoCivil').enumValues;
        res.status(200).send(enumValues);
      });

      controller.post('/recoverPass', function(req, res, next){
          if(request.body.codigo){
            model.findOne(
              {codigo: request.body.codigo},
              function(err, alumno){
                if(err) return response.status(500).send({message:err});
                Usuario.findById(alumno._usuario, function(err, usuario){
                    if(err) return response.status(500).send({message:err});
                    response.status(200).send(usuario.password);
                });
              }
            );
          }else{
              return response.status(412).send({message:err});
          }
      });
      controller.post('/getCode', function(req, res, next){
          if(request.body.email){
              Persona.findOne(
                  {email: request.body.email},
                  function(err, persona){
                      if(err) return response.status(500).send({message:err});
                      console.log(persona);
                      //response.status(200).send(persona);
                      model.findOne(
                          {_persona: persona._id},
                          function(err, alumno){
                              if(err) return response.status(500).send({message:err});
                              response.status(200).send(alumno.codigo);
                          }
                      );
                  }
              );

          }else{
              return response.status(412).send({message:err});
          }
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
        //validate user
        .then(function(grupo){
            var defer = Q.defer();
            Usuario.findOne({username: request.body._usuario.username}, function(err, usuario){
              if(err) return defer.reject({status:500,err:err});
              if(usuario) return defer.reject({status:412,message:'Usuario ya existe'});
              defer.resolve(grupo);
            });
            return defer.promise;
          })
          //validate alumno
        .then(function(grupo){
            var defer = Q.defer();
            model.findOne({'codigo':request.body.codigo},function(err,alumno){
              if(err) return defer.reject({status:500,err:err});
              if(alumno) return defer.reject({status:412,message:'Código de Alumno ya se encuentra registrado'});
              defer.resolve(grupo);
            });
            return defer.promise;
          })
        //create user
        .then(function(grupo){
            var defer = Q.defer();
            usuario = new Usuario(request.body._usuario);
            usuario._grupo = grupo._id;
            usuario.save(function(err,usuario){
              if(err) return defer.reject({status:500,err:err});
              defer.resolve(usuario);
            });
            return defer.promise;
          })
        .then(function(usuario){
          var defer = Q.defer();
          Persona.findOne({'documento':request.body._persona.documento},function(err,persona){
            if(err) return defer.reject({status:500,err:err});
            if(!persona) persona = new Persona(request.body._persona);
            persona.save(function(err,per){
              if(err) return defer.reject({status:500,err:err});
              defer.resolve({usuario:usuario,persona:per});

            });
          });
          return defer.promise;
        })
        .then(function(data){
          request.body._usuario = data.usuario._id;
          request.body._persona = data.persona._id;
          next();
        })
        .catch(function (error) {
          response.status(error.status||500).send(error);
        });
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
