var utils = require('./compromisopago.utils');
var ArchivoBanco = require('../../../models/ArchivoBancoModel.js'); //model de archivo
var CompromisoPago = require('../../../models/CompromisoPagoModel.js'); //model de persona
var fs = require('fs'); //permite escribir y leer en disco
var lockFile = require('lockfile');
var Q = require('q');

var crearAlumno = function crearAlumno(ingresante){
  return alumno;
};
var crearAvanceCurricular = function crearAvanceCurricular(alumno){
  return true;
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
  defer.resolve(true);
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
        console.log(dataArchivo.length);
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
      });
    }
  });
};
