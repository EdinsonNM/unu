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
  PARTICULAR:'03',
  ESTATAL:'02'
};
const PROCESO={
  ORDINARIO:'09',
  INGRESANTE:'23'
};
class CompromisoPagoIngresante{
  constructor(){
    this.ingresantes = [];
    this.tasas = [];
    this.proceso ={};
  }
  generarIngresante(ingresante){
    var self = this;
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
    var tasa =  _.findWhere(self.tasas,{codigo:codigoTasa});
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
  generarIngresantes(ingresantes,next){
    var defer = Q.defer();
    var self = this;
    var promises=[];
    ingresantes.forEach(function(ingresante,index){
      promises.push(self.generarIngresante(ingresante));
    });
    Q.all(promises).then(function(result){
      defer.resolve(result);
    });
    return defer.promise;
  }

  ObtenerTasas(){
    var self = this;
    var defer = Q.defer();
    TasaModel.find({},function(err,tasas){
      if(err) return defer.reject({message:'Error interno del servidor',detail:err,status:500});
      self.tasas = tasas;
      return defer.resolve(tasas);
    });
    return defer.promise;
  }
  ObtenerProcesoPeriodo(tasas){
    var self = this;
    var defer = Q.defer();
    PeriodoModel.findOne({_id:this.periodo})
    .populate({path:'procesos._proceso'})
    .exec(function(err,periodo){
      if(err) return defer.reject(err);
      var proceso = _.find(periodo.procesos,function(item){
        return item._proceso.codigo===PROCESO.INGRESANTE;
      });
      if(!proceso) return defer.reject({message:'No se encuentra definido el proceso de matricula'});
      self.proceso = proceso;
      return defer.resolve({tasas:tasas,proceso:proceso});
    });
    return defer.promise;
  }
  generarCompromisoIngresantes(periodo,ingresantes,next){
    var self = this;
    this.periodo = periodo;

    Q
    .fcall(self.ObtenerTasas.bind(this))
    .then(self.ObtenerProcesoPeriodo.bind(this))
    .then(self.generarIngresantes.bind(this,ingresantes))
    .then(function(result){
      return next(null,result);
    })
    .done();
  }
  generarCompromisoIngresante(ingresante,next){
    let self = this;
    this.escuela = ingresante._escuela;
    this.periodo = ingresante._periodo;
    Q
    .fcall(self.ObtenerTasas.bind(this))
    .then(self.ObtenerProcesoPeriodo.bind(this))
    .then(self.generarIngresante.bind(this,ingresante))
    .then(function(result){
      return next(null,result);
    }).done();
  }
}

module.exports= CompromisoPagoIngresante;
