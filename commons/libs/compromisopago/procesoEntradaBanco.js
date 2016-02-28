var utils = require('./compromisopago.utils');
var ArchivoBanco = require('../../../models/ArchivoBancoModel.js'); //model de archivo
var CompromisoPago = require('../../../models/CompromisoPagoModel.js'); //model de compromisopago
var ingresantes = require('../../../models/IngresanteModel.js'); //model de Ingresante
var alumno = require('../../../models/AlumnoModel.js'); //model de Alumno
var planestudio = require('../../../models/PlanestudioModel.js'); //model de Planestudio
var planestudiodetalle = require('../../../models/PlanestudiodetalleModel.js'); //model de Planestudiodetalle
var tipocondicionalumno = require('../../../models/TipoCondicionAlumnoModel.js'); //model de TipoCondicionAlumno
var situacionalumno = require('../../../models/SituacionAlumnoModel.js'); //model de SituacionAlumno
var escuelas = require('../../../models/EscuelaModel.js'); //model de Escuela
var avancecurricular = require('../../../models/AvanceCurricularModel.js'); //model de AvanceCurricular

var fs = require('fs'); //permite escribir y leer en disco
var lockFile = require('lockfile');
var Q = require('q');
var _ = require('underscore');
var NroCuenta = "";

var crearCodigoAlumno = function crearAlumno(escuelaID, anioPeriodo){
  //return '000' + periodo.substr(0,1) + periodo.substr(2,2) + LPAD(TO_CHAR(PCONTADOR),4,'0');
  var codigo="";
  escuelas.findOne({_id:escuelaID},function(err,escuela){
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
};

var crearAlumno = function crearAlumno(ingresante){
  planestudio.find({estado:'Aprobado'}).populate({path: '_periodo', options: { sort: [['anio', 'desc']] }}).exec(function(err,planesdeestudio){
    var objPlanEstudioVigente = planesdeestudio[0];
    var codigoAlumno = crearCodigoAlumno(ingresante._escuela, objPlanEstudioVigente._periodo.anio);
    tipocondicionalumno.findOne({codigo:'I'},function(err,tipocondicion){
      situacionalumno.findOne({codigo:'01'},function(err,situacion){
        //SE MARCA AL INGRESANTE COMO MATRICULADO
        ingresante.estado = 'Matriculado';
        ingresante.save(function(err, objIngresante){
          //SE INGRESA LA DATA DEL ALUMNO
          alumno.codigo = codigoAlumno;
          alumno.estadoCivil = 'Soltero(a)';
          alumno._persona = objIngresante._persona;
          alumno._ingresante = objIngresante._id;
          alumno._periodoInicio = objPlanEstudioVigente._periodo;
          alumno._facultad = objIngresante._facultad;
          alumno._escuela = objIngresante._escuela;
          alumno._tipoCondicionAlumno = tipocondicion._id;
          alumno._situacionAlumno = situacion._id;
          alumno._usuario = codigoAlumno;
          alumno.save(function(err,objAlumno){
            if(err) return null;
          });
        });
      });
    });
  });
  return alumno;
};

var crearAvanceCurricular = function crearAvanceCurricular(alumno){
  planestudio.findOne({_periodo:alumno._periodoInicio, _escuela:alumno._escuela}, function(err,objPlanEstudio){
    planestudiodetalle.find({_planestudio:objPlanEstudio._id},function(err,listaDetallesPlan){
      var itemDetalle = {};
      var listaDetalles = [];
      avancecurricular.secuencia = 1;
      avancecurricular._alumno = alumno._id;
      avancecurricular._planEstudios = objPlanEstudio._id;
      avancecurricular.activo = true;
      avancecurricular.createdAt = new Date();

      for (var i = 0; i < listaDetallesPlan.length; i++) {
        itemDetalle = {};
        itemDetalle._planEstudiosDetalle = listaDetallesPlan[i]._id;
        itemDetalle.numeroVeces = 1;
        itemDetalle.record = [];
        listaDetalles.push(itemDetalle);
      }
      avancecurricular.detalleAvance = listaDetalles;
      avancecurricular.save(function(err,avance){
        if(err){
          console.log(err);
          return null;
        }
        else{
          return true;
        }
      });
    });
  });
};

var procesarIngresante = function(ingresante){
  var defer = Q.defer();
  crearAlumno(ingresante,function(err,alumno){
    if(err) defer.reject(err);
    crearAvanceCurricular(alumno,function(err,alumno){
      if(err) defer.reject(err);
      return defer.resolve(true);
    });
  });
  return defer.promise;
};
var procesarIngresantes = function(ingresantes,next){
  var promises=[];
  ingresantes.forEach(function(ingresante){
    promises.push(procesarIngresante(ingresante));
  });
  Q.all(promises).then(function(result){
    next(null,result);
  });
};

var procesarPago = function procesarPago(item,index){
  var defer = Q.defer();
  //NOTE si el pago pertenece a un ingresante entonces retorna ingresante defe.resolve(ingresante) si no defer.resolve(null)
  //NOTE si el proceso falla defer.reject(error);
  var NombreCliente = item.substring(2,30);
  var Referencias = item.substring(32,48);//SE ASUMIRÁ QUE DE LOS 48 CARACTERES DE LA REFERENCIA: IDENTIFICADOR DEL PAGO [10], DNI PAGADOR [10], ALGUN DATO ADICIONAL [28]
    var documentoPagador = Referencias.substring(0,8);
    var codigoPago = Referencias.substring(8,10);
    var adicionalPago = Referencias.substring(18,28);
  var ImporteOrigen = parseFloat(item.substring(80,13))/100;
  var ImporteDepositado = parseFloat(item.substring(95,15))/100;
  var ImporteMora = parseFloat(item.substring(110,15))/100;
  var Oficina = item.substring(125,4);
  var NroMovimiento = item.substring(129,6);
  var FechaPago = new Date(item.substring(135,8));
  var TipoValor = item.substring(143,2);
  var CanalEntrada = item.substring(145,2);

  CompromisoPago.findOne({codigo:codigoPago},function(err, compromisopago){
    compromisopago.detallePago.push({
      nroMovimiento: NroMovimiento,
      fechaPago: FechaPago,
      totalPagado: ImporteDepositado,
      montoPago: ImporteDepositado - ImporteMora,
      montoMora: ImporteMora,
      oficinaPago: Oficina,
      institucion: '',
      cuenta: NroCuenta,
      fechaImportacion: new Date(),
      _archivobanco: ArchivoBanco._id
    });
    compromisopago.save(function(err,objCompromisoPago){
      if(err){
        console.log(err);
        defer.reject(err);
      }else{
        //SE DETERMINA SI EL COMPROMISO DE PAGO PERTENECE A UN INGRESANTE
        ingresantes.findOne({_persona:compromisopago._persona, estado:'Registrado'}, function(err,ingresante){
          if(err){
            defer.reject(err);
          }else{
            if(!ingresante) defe.resolve(null);
            else{
              if(objCompromisoPago.pagado) defe.resolve(ingresante);
              else defe.resolve(null);
            }
          }
        });
      }
    });
    /*
    compromisopago.update({_id:compromisopago._id},
                          {$set:{
                              pagado: pagado + ImporteDepositado - ImporteMora,
                              saldo: saldo - (ImporteDepositado - ImporteMora),
                              moratotal: moratotal + ImporteMora,
                              detallePago: detallesPago
                            }
                          },
                          function(err, cp){
                            if(err){
                              console.log(err);
                            }else{
                              //SE DETERMINA SI EL COMPROMISO DE PAGO PERTENECE A UN INGRESANTE
                              ingresantes.findOne({_persona:compromisopago._persona, estado:'Registrado'}, function(err,ingresante){
                                if(err){
                                  defer.reject(error);
                                }else{
                                  if(ingresante === undefined) defe.resolve(null);
                                  else defe.resolve(ingresante);
                                }
                              });
                            }
                          }
    );
    */
  });
  //defer.resolve(true);
  //proceso de actualización de pagos
  return defer.promise;
};
module.exports  = function(filename,next){
  if ( !filename || typeof filename != 'string' ) next("filename (string) is required.");
  var pathFile = filename;
  var pathLockFile = filename+'.lock';
  lockFile.lock ( pathLockFile, {}, function ( error )
  {
    if ( error ) return next(error);
    else {
      fs.readFile( pathFile, 'utf8', function ( error , data ) {
        if(error) return next(error);
        var dataArchivo = data.split("\n");
        nrolineas = dataArchivo.length;
        var cabecera = dataArchivo.shift();
        var totales = dataArchivo.pop();
        var promises = [];

        NroCuenta = cabecera.substring(27,18);
        //SE REGISTRA LOS DATOS DEL ARCHIVO CARGADO
        ArchivoBanco.nombre = filename;
        ArchivoBanco.registros = dataArchivo.length;
        ArchivoBanco.importeTotal = parseFloat(totales.substring(11,15))/100;//SE ASUME QUE LOS 2 ULTIMOS DÍGITOS SON LOS DECIMALES
        ArchivoBanco.tipo = 'E';
        ArchivoBanco.fechabanco = new Date(cabecera.substring(19,8));
        ArchivoBanco.version = 1;
        ArchivoBanco.createdAt = new Date();
        ArchivoBanco.updatedAt = new Date();
        ArchivoBanco.save(function(err){
          if(err){ console.log(err); return null; }
          else{
            //EJECUCIÓN DE CADA LINEA DEL ARCHIVO
            dataArchivo.forEach(function(item,index){
              promises.push(procesarPago(item,index));
            });
            Q.all(promises).then(
              function(result){
                console.log(result);//[ingresante,null,null,ingresante];
                var ingresantes =  _.reject(result, function(item){ return item === null; });
                procesarIngresantes(ingresantes,function(err,data){
                  if(err){
                    console.log(err);
                  }else{
                    console.log('importación es OK');
                  }
                });
              },
              function(result){
                //si falla el proceso de un pago
                console.log(result);
              });
          }
        });
      });
    }
  });
};
