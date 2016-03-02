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
  var NombreCliente = item.substr(2,30);
  var Referencias = item.substr(32,48);//SE ASUMIRÁ QUE DE LOS 48 CARACTERES DE LA REFERENCIA: IDENTIFICADOR DEL PAGO [10], DNI PAGADOR [10], ALGUN DATO ADICIONAL [28]
    var codigo = Referencias.substr(0,10);
    var descripcionTasa = Referencias.substr(10,14);
    var compromisoId = Referencias.substr(24,24);
  var ImporteOrigen = parseFloat(item.substr(80,15))/100;
  var ImporteDepositado = parseFloat(item.substr(95,15))/100;
  var ImporteMora = parseFloat(item.substr(110,15))/100;
  var Oficina = item.substr(125,4);
  var NroMovimiento = item.substr(129,6);
  var FechaPago = new Date(item.substr(135,4)+'-'+item.substr(139,2)+'-'+item.substr(141,2));
  var TipoValor = item.substr(143,2);
  var CanalEntrada = item.substr(145,2);

  CompromisoPago.findOne({_id:compromisoId},function(err, compromisopago){
    if(err) return defer.reject(err);
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
        ingresantes.findOne({_persona:compromisopago._persona, estado:'Aprobado'}, function(err,ingresante){
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

        var cabecera = dataArchivo.shift();
        var totales = dataArchivo.pop();
        nrolineas = dataArchivo.length;
        var promises = [];

        NroCuenta = cabecera.substring(27,18);
        //SE REGISTRA LOS DATOS DEL ARCHIVO CARGADO
        var archivoBanco = new ArchivoBanco();
        archivoBanco.nombre = filename;
        archivoBanco.registros = dataArchivo.length;
        archivoBanco.importeTotal = parseFloat(totales.substr(11,15))/100;//SE ASUME QUE LOS 2 ULTIMOS DÍGITOS SON LOS DECIMALES
        archivoBanco.tipo = 'E';
        archivoBanco.fechabanco = new Date(cabecera.substr(19,4)+'-'+cabecera.substr(23,2)+'-'+cabecera.substr(25,2));
        archivoBanco.version = 1;
        archivoBanco.createdAt = new Date();
        archivoBanco.updatedAt = new Date();
        archivoBanco.save(function(err){
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
