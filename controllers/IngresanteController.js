var model = require('../models/IngresanteModel.js');
var Validator = require('jsonschema').Validator;
var schemaPago  = require('../schemas/ingresante-pagos');
module.exports = function() {
  var baucis = require('baucis');
  return {
    setup: function() {
      var controller = baucis.rest('Ingresante');
      controller.fragment('/ingresantes');

      controller.get('/model/estado', function(req, res, next){
        var enumValues = model.schema.path('estado').enumValues;
        res.status(200).send(enumValues);
      });


      controller.request('post', function (request, response, next) {
        Q.fcall(function(){
            var defer = Q.defer();
            model.findOne({'codigo':request.body.codigoPostulante},function(err,postulante){
              if(err) return defer.reject({status:500,err:err});
              if(postulante) return defer.reject({status:412,message:'Código de Postulante ya se encuentra registrado'});
              defer.resolve(true);
            });
            return defer.promise;
          })

        .then(function(result){
          var defer = Q.defer();
          Persona.findOne({'documento':request.body._persona.documento},function(err,persona){
            if(err) return defer.reject({status:500,err:err});
            if(!persona) persona = new Persona(request.body._persona);
            persona.save(function(err,per){
              if(err) return defer.reject({status:500,err:err});
              defer.resolve(per);

            });
          });
          return defer.promise;
        })
        .then(function(persona){
          request.body._persona = persona._id;
          next();
        })
        .catch(function (error) {
          response.status(error.status||500).send(error);
        });
      });

      controller.post('/updateEstadoAprIngresante', function(request, response, next){
          if(request.body._id){
            model.findByIdAndUpdate(
              request.body._id,
              { estado: 'Aprobado' },
              { safe: true },
              function(err, data){
                if(err) return response.status(500).send({message:err});
                response.status(200).send(data);
              }
            );
          }else{
            var query = {
              _periodo: request.body._periodo,
              _escuela: request.body._escuela,
              estado: 'Registrado'
            };
            model.update(query, { $set: { estado: 'Aprobado' }}, {multi: true}, function (err, numAffected) {
              // numAffected is the number of updated documents
              if(err) return response.status(500).send({message:err});
              response.status(200).send('Hola');
            });
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
            populate: ['_modalidad', '_escuela', '_facultad', '_periodo','_persona']
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

      var ProcesoPago = {
        BuscarIngresante: function BuscarIngresante(idIngresante,next){
          var errorData = {
            status:null,
            message:''
          };
          model.find({_id:idIngresante},function(error,ingresante){
            if(error){
              errorData.status = 500;
              errorData.message = "Ocurrio un error mientras se buscaba el ingresante";
              error.detalle = error;
              return next(errorData);
            }
            if(!ingresante){
              errorData.status = 404;
              errorData.message = "No se encontro el ingresante";
              return next(errorData);
            }
            return next(null,ingresante);
          });
        },
        ValidarTasa: function ValidarTasa(){
        },
        RegistrarAlumno: function RegistrarAlumno(){

        },
        CrearAvanceCurricular:function CrearAvanceCurricular(){

        },
        RegistrarPago:function RegistrarPago(){

        },
        EnviarEmail:function EnviarEmail(){

        }
      };
      controller.post('/methods/procesarpago',function(req,res){
        var v = new Validator();
        var result = v.validate(req.body, schemaPago);
        if(result.errors.length>0) return res.status(400).send(result.errors);
        ProcesoPago.BuscarIngresante(req.body._ingresante,function(error,ingresante){
          if(error) return res.status(error.status).send(error);
          ProcesoPago.ValidarTasa(ingresante._modalidadIngresa,req.body.monto,function(error,result){
            if(error) return res.status(500).send(error);
            if(result){
              var detallepago = {
                voucher:req.body.voucher,
                fecha:req.body.fecha,
                monto: req.body.monto
              };
              ProcesoPago.RegistrarPago(detallepago,function(error,detallepago){
                if(error) return res.status(500).send(error);
                ProcesoPago.RegistrarAlumno(ingresante,function(error,alumno){
                  if(error) return res.status(500).send(error);
                  ProcesoPago.CrearAvanceCurricular(alumno,function(error,avance){
                    if(error) return res.status(500).send(error);
                    ProcesoPago.EnviarEmail(function(error,data){
                      return res.status(202).send(alumno);
                    });
                  });
                });
              });
            }else{

            }
          });
        });

      });
    }
  };
};
