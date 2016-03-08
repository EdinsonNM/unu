var utils = require('./compromisopago.utils');
var ArchivoBanco = require('../../../models/ArchivoBancoModel.js'); //model de archivo
var CompromisoPago = require('../../../models/CompromisoPagoModel.js'); //model de compromisopago
var ingresantes = require('../../../models/IngresanteModel.js'); //model de Ingresante
var AlumnoModel = require('../../../models/AlumnoModel.js'); //model de Alumno
var UsuarioModel = require('../../../models/UsuarioModel.js'); //model de Alumno
var GrupoModel = require('../../../models/GrupoModel.js'); //model de Alumno

var planestudio = require('../../../models/PlanestudioModel.js'); //model de Planestudio
var planestudiodetalle = require('../../../models/PlanestudiodetalleModel.js'); //model de Planestudiodetalle
var tipocondicionalumno = require('../../../models/TipoCondicionAlumnoModel.js'); //model de TipoCondicionAlumno
var situacionalumno = require('../../../models/SituacionAlumnoModel.js'); //model de SituacionAlumno
var escuelas = require('../../../models/EscuelaModel.js'); //model de Escuela
var AvanceCurricularModel = require('../../../models/AvanceCurricularModel.js'); //model de AvanceCurricular

var Matricula = require('../../../models/MatriculaModel.js'); //model de Alumno
var FichaMatricula = require('../../../models/FichaMatriculaModel.js'); //model de Alumno


var fs = require('fs'); //permite escribir y leer en disco
var lockFile = require('lockfile');
var Q = require('q');
var _ = require('underscore');
var NroCuenta = "";
var tipoCondicion,situacion,grupoAlumno;

var crearCodigoAlumno = function crearAlumno(escuela, anioPeriodo){
  var defer = Q.defer();
  var codigo="";
  var correlativo = 0;
  var indexCorrelativo = -1;
  indexCorrelativo =  _.findIndex(escuela._correlativosAnio, {anio:anioPeriodo});
  if(indexCorrelativo!=-1){
    correlativo = escuela._correlativosAnio[indexCorrelativo].correlativo;
    escuela._correlativosAnio[indexCorrelativo].correlativo = correlativo + 1;
  }else{
    escuela._correlativosAnio.push({anio:anioPeriodo,correlativo:1});
  }
  escuela.save(function(err,data){
    if(err) return defer.reject(err);
    correlativo+=1;
    codigo = utils.pad(escuela.codigo,3,'0') + utils.pad(anioPeriodo.toString(),4,'0') + utils.pad(correlativo.toString(),3,'0');
    return defer.resolve(codigo);

  });
  return defer.promise;

};

var crearAlumno = function crearAlumno(ingresante,next){

  planestudio.find({estado:'Aprobado',_escuela:ingresante._escuela}).populate('_periodo _escuela').exec(function(err,planesdeestudio){
    if(err) return next(err);

    var objPlanEstudioVigente = _.sortBy(planesdeestudio, function(item){ return -item._periodo.anio; })[0];
    crearCodigoAlumno(objPlanEstudioVigente._escuela,ingresante._periodo.anio).then(function(codigo){
      //if(err) return next(err);
      ingresante.estado = 'Matriculado';
      ingresante.save(function(err, objIngresante){
        if(err) return next(err);
        var alumno = new AlumnoModel({
          codigo : codigo,
          estadoCivil : 'Soltero(a)',
          _persona : objIngresante._persona,
          _ingresante : objIngresante._id,
          _periodoInicio : objIngresante._periodo._id,
          _facultad : objIngresante._facultad,
          _escuela : objIngresante._escuela,
          _tipoCondicionAlumno : tipocondicion._id,
          _situacionAlumno : situacion._id
        });

        var usuario = new UsuarioModel({
          username:codigo,
          password:codigo,
          _grupo:grupoAlumno._id
        });
        usuario.save(function(err,objUsuario){
          if(err) return next(err);
          alumno._usuario = objUsuario._id;
          alumno.save(function(err,objAlumno){
            if(err) return next(err);
            return next(null,{alumno:objAlumno,planestudio:objPlanEstudioVigente});
          });
        });

      });
    });
  });

};

var crearAvanceCurricular = function crearAvanceCurricular(dataAlumno,next){
    planestudiodetalle.find({_planestudio:dataAlumno.planestudio._id},function(err,listaDetallesPlan){
      if(err) return next(err);
      var itemDetalle = {};
      var listaDetalles = [];
      var avancecurricular = new AvanceCurricularModel();
      avancecurricular.secuencia = 1;
      avancecurricular._alumno = dataAlumno.alumno._id;
      avancecurricular._planEstudios = dataAlumno.planestudio._id;
      avancecurricular.activo = true;
      avancecurricular.createdAt = new Date();


      for (var i = 0; i < listaDetallesPlan.length; i++) {
        itemDetalle = {};
        itemDetalle._planEstudiosDetalle = listaDetallesPlan[i]._id;
        itemDetalle.numeroVeces = 0;
        itemDetalle.record = [];
        listaDetalles.push(itemDetalle);
      }
      avancecurricular.detalleAvance = listaDetalles;
      avancecurricular.save(function(err,avance){
        if(err) return next(err);
        dataAlumno.avance = avance;
        dataAlumno.detalleAvance = listaDetalles;
        dataAlumno.alumno._avanceCurricular.push(avance._id);
        dataAlumno.alumno.save(function(err,alumno){
          if(err) return next(err);
          return next(null,dataAlumno);
        });
      });
    });

};
var crearMatricula = function(dataAlumno,next){
  var itemDetalle = {};
  var matricula = new Matricula();
  matricula._alumno = dataAlumno.alumno._id;
  matricula._planEstudio = dataAlumno.planestudio._id;
  matricula._periodo = dataAlumno.alumno._periodoInicio;
  matricula._escuela = dataAlumno.alumno._escuela;
  matricula.save(function(err,data){
    if(err) return next(err);
    return next(null,dataAlumno);
  });

};
var crearFichaMatricula = function(dataAlumno,next){
  var itemDetalle = {};
  var fichaMatricula = new FichaMatricula();
  fichaMatricula._alumno = dataAlumno.alumno._id;
  fichaMatricula._periodo = dataAlumno.alumno._periodoInicio;
  fichaMatricula._escuela = dataAlumno.alumno._escuela;
  fichaMatricula._condicionAlumno = dataAlumno.alumno._tipoCondicionAlumno;
  fichaMatricula.save(function(err,ficha){
    if(err) return next(err);
    for (var i = 0; i < dataAlumno.detalleAvance.length; i++) {
      if(dataAlumno.detalleAvance[i].ciclo===1){
        data._detalles.push({_fichaMatricula:data._id,_planEstudiosDetalle:dataAlumno.detalleAvance[i]._id,numeroVeces:0});
      }
    }
    ficha.save(function(err,data){
      if(err) return next(err);
      return next(null,dataAlumno);
    });
  });

};
var procesarIngresante = function(ingresante){
  var defer = Q.defer();
  crearAlumno(ingresante,function(err,dataAlumno){
    if(err) return defer.reject(err);
    crearAvanceCurricular(dataAlumno,function(err,result){
      if(err) return defer.reject(err);
      crearMatricula(dataAlumno,function(err,result){
        if(err) return defer.reject(err);
        crearFichaMatricula(dataAlumno,function(err,result){
          if(err) return defer.reject(err);
          return defer.resolve(result.alumno);
        });
      });
    });
  });
  return defer.promise;
};

var procesarPago = function procesarPago(item,index){
  console.log("item:",item);
  var defer = Q.defer();
  var NombreCliente = item.substr(2,30);
  // INFO referencias = codigo+descripcionTasa+compromisoId
  var Referencias,codigo,
  descripcionTasa,compromisoId,
  ImporteOrigen,ImporteDepositado,
  ImporteMora,Oficina,NroMovimiento,FechaPago,
  TipoValor,CanalEntrada;

  try {
    NombreCliente = item.substr(2,30);
    // INFO referencias = codigo+descripcionTasa+compromisoId
    Referencias = item.substr(32,48);
    codigo = Referencias.substr(0,10);
    descripcionTasa = Referencias.substr(10,14);
    compromisoId = Referencias.substr(24,24);
    ImporteOrigen = parseFloat(item.substr(80,15))/100;
    ImporteDepositado = parseFloat(item.substr(95,15))/100;
    ImporteMora = parseFloat(item.substr(110,15))/100;
    Oficina = item.substr(125,4);
    NroMovimiento = item.substr(129,6);
    FechaPago = new Date(item.substr(135,4)+'-'+item.substr(139,2)+'-'+item.substr(141,2));
    TipoValor = item.substr(143,2);
    CanalEntrada = item.substr(145,2);

  } catch (e) {
    return defer.reject(e);
  }

  CompromisoPago.findOne({_id:compromisoId},function(err, compromisopago){
    if(err) return defer.reject(err);
    if(!compromisopago) return defer.resolve({message:'No se encontro el compromiso'});
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
    ingresantes.findOne({
      _persona:compromisopago._persona,
      estado:'Aprobado'
    }).populate('_periodo').exec(function(err,ingresante){
      if(err) return defer.reject(err);
      if(!ingresante){
        compromisopago.save(function(err,objCompromisoPago){
          if(err) return defer.reject(err);
          return defer.resolve(objCompromisoPago);
        });
      }else{
        procesarIngresante(ingresante).then(
          function(alumno){
            compromisopago.referenciAlumno = alumno.codigo;
            compromisopago.save(function(err,objCompromisoPago){
              if(err) return defer.reject(err);
              return defer.resolve(objCompromisoPago);
            });
          },function(result){
            return defer.reject(result);
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

        NroCuenta = cabecera.substr(27,18);

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
        Q.fcall(function(){
          var defer = Q.defer();
          archivoBanco.save(function(err,archivo){
            if(err){ console.log(err); return defer.reject(err); }
            return defer.resolve(archivo);
          });
          return defer.promise;
        })
        .then(function(archivo){
          var defer = Q.defer();
          tipocondicionalumno.findOne({codigo:'01'},function(err,tc){
            if(err) return defer.reject(err);
            return defer.resolve({archivo:archivo,tipocondicion:tc});
          });
          return defer.promise;
        })
        .then(function(result){
          var defer = Q.defer();
          situacionalumno.findOne({codigo:'01'},function(err,st){
            if(err) return defer.reject(err);
            result.situacion = st;
            return defer.resolve(result);
          });
          return defer.promise;
        })
        .then(function(result){
          var defer = Q.defer();
          GrupoModel.findOne({codigo:'ALUMNO'}).exec(function(err,gr){
            if(err) return next(err);
            result.grupoAlumno = gr;
            return defer.resolve(result);
          });
          return defer.promise;
        })
        .then(function(result){
          grupoAlumno = result.grupoAlumno;
          situacion = result.situacion;
          tipocondicion = result.tipocondicion;
          var x = Q.fcall(function(){});
          dataArchivo.forEach(function(item,index){
            x=x.then(procesarPago.bind(this,item));
          });
          x.then(function(){
            console.log('finalizo..');
          }).done();

        })
        .done();

      });
    }
  });
};
