var utils = require('./compromisopago.utils');
var ArchivoBanco = require('../../../models/ArchivoBancoModel.js'); //model de archivo
var CompromisoPago = require('../../../models/CompromisoPagoModel.js'); //model de persona
var fs = require('fs'); //permite escribir y leer en disco
var lockFile = require('lockfile');
var Q = require('q');

var processItem = function processItem(item,index){
  var defer = Q.defer();
  console.log(index+"-",item);
  setTimeout(function(){
    defer.resolve(true);
  },1000);
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
          promises.push(processItem(item,index));
        });
        Q.all(promises).then(
          function(result){
            console.log(result);
          },
          function(result){
            console.log(result);
          });
      });
    }
  });
};
