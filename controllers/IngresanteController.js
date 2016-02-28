var Persona = require('../models/PersonaModel.js');
var model = require('../models/IngresanteModel.js');
//var mdoelTipoTasa = require('../models/TipoTasaModel.js');
//var modelTasa = require('../models/TasaModel.js');
var modelCompromisoPago = require('../models/CompromisoPagoModel.js');
var modelPlanEstudio = require('../models/PlanestudioModel.js');
var modelEscuela = require('../models/EscuelaModel.js');
var modelTipoCondicionAlumno = require('../models/TipoCondicionAlumnoModel.js');
var modelSituacionAlumno = require('../models/SituacionAlumnoModel.js');
var modelAlumno = require('../models/AlumnoModel.js');
var modelPlanEstudioDetalle = require('../models/PlanestudiodetalleModel.js');
var modelAvanceCurricular = require('../models/AvanceCurricularModel.js');

var Validator = require('jsonschema').Validator;
var schemaPago  = require('../schemas/ingresante-pagos');
var Q = require('q');
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
          //model.find({_id:idIngresante},function(error,ingresante){
          model.findOne({_id:idIngresante}).populate({path:'Persona'}).exec(function(error,ingresante){
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
        ValidarTasa: function ValidarTasa(objIngresante, codigoCompromisoPago, montoPagado, montoMora, fechaDelPago){

        },
        crearCodigoAlumno: function crearAlumno(escuelaID, anioPeriodo){
          var codigo="";
          modelEscuela.findOne({_id:escuelaID},function(err,escuela){
            var correlativo = 0;//parseInt(_.find(escuela._correlativosAnio, function(data){ return data.anio == anioPeriodo; })) + 1;
            if(escuela._correlativosAnio.length === 0 || escuela._correlativoAnio === null){
              for (var i = 0; i < escuela._correlativosAnio.length; i++) {
                if(escuela._correlativosAnio[i].anio == anioPeriodo){
                  correlativo = escuela._correlativosAnio[i].correlativo + 1;
                  codigo = escuela.codigo + anioPeriodo.toString() + utils.pad(correlativo.toString(),3,'0');
                  escuela._correlativosAnio[i].correlativo = correlativo;
                  break;
                }
              }
            }
            else {
              correlativo = correlativo + 1;
              codigo = escuela.codigo + anioPeriodo.toString() + utils.pad(correlativo.toString(),3,'0');
              escuela._correlativosAnio.push({anio:anioPeriodo,correlativo:correlativo});
            }
            escuela.save(function(err,objEscuela){
              if(err){ console.log(err); return null; }
            });
            return codigo;
          });
        },
        RegistrarAlumno: function RegistrarAlumno(objIngresante){
          modelPlanEstudio.find({estado:'Aprobado'}).populate({path: '_periodo', options: { sort: [['anio', 'desc']] }}).exec(function(err,planesdeestudio){
            var objPlanEstudioVigente = planesdeestudio[0];
            var codigoAlumno = crearCodigoAlumno(objIngresante._escuela, objPlanEstudioVigente._periodo.anio);
            modelTipoCondicionAlumno.findOne({codigo:'I'},function(err,tipocondicion){
              modelSituacionAlumno.findOne({codigo:'01'},function(err,situacion){
                //SE MARCA AL INGRESANTE COMO MATRICULADO
                objIngresante.estado = 'Matriculado';
                objIngresante.save(function(err, dataIngresante){
                  //SE INGRESA LA DATA DEL ALUMNO
                  modelAlumno.codigo = codigoAlumno;
                  modelAlumno.estadoCivil = 'Soltero(a)';
                  modelAlumno._persona = dataIngresante._persona;
                  modelAlumno._ingresante = dataIngresante._id;
                  modelAlumno._periodoInicio = objPlanEstudioVigente._periodo;
                  modelAlumno._facultad = dataIngresante._facultad;
                  modelAlumno._escuela = dataIngresante._escuela;
                  modelAlumno._tipoCondicionAlumno = tipocondicion._id;
                  modelAlumno._situacionAlumno = situacion._id;
                  modelAlumno._usuario = codigoAlumno;
                  modelAlumno.save(function(err,objAlumno){
                    if(err) return null;
                    else return objAlumno;
                  });
                });
              });
            });
          });
        },
        CrearAvanceCurricular:function CrearAvanceCurricular(alumno){
          modelPlanEstudio.findOne({_periodo:alumno._periodoInicio, _escuela:alumno._escuela}, function(err,objPlanEstudio){
            modelPlanEstudioDetalle.find({_planestudio:objPlanEstudio._id},function(err,listaDetallesPlan){
              var itemDetalle = {};
              var listaDetalles = [];
              modelAvanceCurricular.secuencia = 1;
              modelAvanceCurricular._alumno = alumno._id;
              modelAvanceCurricular._planEstudios = objPlanEstudio._id;
              modelAvanceCurricular.activo = true;
              modelAvanceCurricular.createdAt = new Date();

              for (var i = 0; i < listaDetallesPlan.length; i++) {
                itemDetalle = {};
                itemDetalle._planEstudiosDetalle = listaDetallesPlan[i]._id;
                itemDetalle.numeroVeces = 1;
                itemDetalle.record = [];
                listaDetalles.push(itemDetalle);
              }
              modelAvanceCurricular.detalleAvance = listaDetalles;
              modelAvanceCurricular.save(function(err,avance){
                if(err){
                  console.log(err);
                  return err;
                }
                else{
                  return true;
                }
              });
            });
          });
        },
        RegistrarPago:function RegistrarPago(informacionPago, objIngresante){
          modelCompromisoPago.findOne({codigo:informacionPago.compomisoPago},function(err, objCompromisoPago){
            objCompromisoPago.detallePago.push({
              nroMovimiento: informacionPago.nroOperacion,
              fechaPago: informacionPago.fechaPago,
              totalPagado: informacionPago.totalPagado,
              montoPago: informacionPago.totalPagado - informacionPago.montoMora,
              montoMora: informacionPago.montoMora,
              oficinaPago: informacionPago.oficina,
              institucion: '',
              cuenta: informacionPago.nroCuentaAbono,
              fechaImportacion: new Date(),
              _archivobanco: null
            });
            objCompromisoPago.save(function(err,dataCompromisoPago){
              if(err){
                console.log(err);
                return null;
              }else{
                if(dataCompromisoPago.pagado) return dataCompromisoPago;
                else return null;
              }
            });
          });
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
          /*ProcesoPago.ValidarTasa(ingresante, req.body.compromisoPago, req.body.monto, req.body.mora, req.body.fechaPago, function(error,result){
            if(error) return res.status(500).send(error);
            if(result){*/
              var detallepago = {
                compomisoPago: req.body.compromisoPagoId,
                nroOperacion: req.body.nroOperacion,
                fechaPago: req.body.fechaPago,
                totalPagado: req.body.montoPagado,
                montoMora: req.body.mora,
                oficina: req.body.oficinaPago,
                nroCuentaAbono: req.body.cuentaAbono
              };
              ProcesoPago.RegistrarPago(detallepago, ingresante, function(error,detallepago){
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
            /*}else{

            }
          });*/
        });

      });
    }
  };
};
