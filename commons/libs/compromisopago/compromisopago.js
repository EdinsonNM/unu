'use strict';
/* jshint esnext:true*/
var Ingresante = require('../../../models/IngresanteModel.js');
var Alumno = require('../../../models/AlumnoModel.js');
var CompromisoPagoModel = require('../../../models/CompromisoPagoModel.js');
var TasaModel = require('../../../models/TasaModel.js');
var PeriodoModel = require('../../../models/PeriodoModel.js');

var util = require('./compromisopago.utils');
var Q = require('q');
var _ = require('underscore');
//var Periodo = require('../../models/PeriodoModel.js');/*
const TASA={
  ORDINARIA:'01',
  PARTICULAR:'02',
  ESTATAL:'03'
};
const PROCESO={
  ORDINARIO:'09',
  INGRESANTE:'23'
};
class CompromisoPago{
  constructor(periodo,tipo){
    this.periodo = periodo;
    this.tipo = tipo;
    this.ingresantes = [];
    this.tasas = [];
  }
  generarIngresante(ingresante){
    var defer = Q.defer();
    var codigoTasa;
    switch (ingresante.tipoColegio) {
      case 'Estatal':
        codigoTasa = TASA.ESTATAL;
        break;
      case 'Particular':
        codigoTasa = TASA.PARTICULAR;
        break;
    }
    var tasa =  _.findWhere(this.tasas,{codigo:codigoTasa});
    var montoTasa  = _.findWhere(tasa.historial,{activo:true});
    var compromiso = new CompromisoPagoModel({
      codigo:util.pad(ingresante._persona.documento,10,'0'),
      importe:montoTasa.importe,
      saldo:montoTasa.importe,
      fechavenc:this.proceso.fechaFin,
      _tasa:tasa._id,
      _persona:ingresante._persona._id,
      _periodo: this.periodo
    });
    compromiso.save(function(err,data){
      if(err) return defer.reject(err);
      defer.resolve(data);
    });
    return defer.promise;
  }
  generarIngresantes(next){
    var self = this;
    Ingresante.find({
      estado:'Aprobado',
      _periodo:this.periodo
    })
    .populate('modalidad')
    .populate('_persona')
    .exec(function(err,ingresantes){
      if(err) return next(err);
      var promises = [];
      ingresantes.forEach(function(ingresante,index){
        promises.push(self.generarIngresante(ingresante));
      });
      Q.all(promises).then(function(result){
        next(null,result);
      });

    });
  }
  generarAlumno(){

  }
  generar(next){
    var self = this;
    Q.fcall(function(){
      var defer = Q.defer();
      TasaModel.find({},function(err,tasas){
        defer.resolve(tasas);
      });
      return defer.promise;
    })
    .then(function(tasas){
      var defer = Q.defer();

      PeriodoModel.findOne({_id:self.periodo})
      .populate({path:'procesos._proceso'})
      .exec(function(err,periodo){
        var codigoProceso;
        switch (self.tipo) {
          case 'ingresante':
            codigoProceso= PROCESO.INGRESANTE;break;
          case 'alumno':
            codigoProceso= PROCESO.ORDINARIO;break;
        }
        if(err) return next(err);
        var proceso = _.find(periodo.procesos,function(item){
          return item._proceso.codigo===codigoProceso;
         });
        if(!proceso) return defer.reject({message:'No se encuentra definido el proceso de matricula'});
        defer.resolve({tasas:tasas,proceso:proceso});
      });
      return defer.promise;
    })
    .then(function(result){
      self.tasas = result.tasas;
      self.proceso = result.proceso;
      switch (self.tipo) {
        case 'ingresante':
          self.generarIngresantes(next);
          break;
        case 'alumno':
          self.generarAlumno(next);
          break;
      }
    });

  }
}

module.exports= CompromisoPago;
