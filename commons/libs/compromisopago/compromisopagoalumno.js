'use strict';
/* jshint esnext:true*/
var Alumno = require('../../../models/AlumnoModel.js');
var CompromisoPago = require('../../../models/CompromisoPagoModel.js');
var Tasa = require('../../../models/TasaModel.js');
var Matricula = require('../../../models/MatriculaModel.js');
var Periodo = require('../../../models/PeriodoModel.js');
var util = require('./compromisopago.utils');
var Q = require('q');
var _ = require('underscore');

const TASA={
  PAGO_ORDINARIO:'01',
  PAGO_RECARGO_EXTEMPORANEO:'02',
  PAGO_REPETICION_CURSO:'03',
  PERDIDA_GRATUIDAD:{
    OBSERVADO:''
  }
};
const PROCESO={
  ORDINARIO:'09',
  EXTRAORDINARIO:''
};
class CompromisoPagoAlumno{
  constructor(matriculaId){
    this.matriculaId = matriculaId;
    this.deudas=[];
    this.tasas=[];
    this.matricula = {};
  }

  ObenerPagoReactualizacionMatricula(alumno){
    var defer = Q.defer();
    //if(alumno.condicion===)
  }
  ObtenerMatricula(){
    var self = this;
    var defer = Q.defer();
    Matricula.finOne({_id:this.matriculaId})
    .populate([
      {path:'_alumno'},
      {path:'_detalleMatricula'},
      {path:'_periodo',populate:{path:'procesos._proceso',model:'Proceso'}}
    ])
    .exec(function(err,matricula){
      if(err) return defer.reject({message:'Error interno del servidor',detail:err,status:500});
      if(!matricula) return defer.reject({message:'Matricula no encontrada',detail:err,status:404});
      self.matricula = matricula;
      return defer.resolve(null,matricula);
    });
    return defer.promise;

  }
  ObtenerTasas(){
    var self = this;
    var defer = Q.defer();
    Tasa.find({},function(err,tasas){
      if(err) return defer.reject({message:'Error interno del servidor',detail:err,status:500});
      self.tasas = tasas;
      return defer.resolve(tasas);
    });
    return defer.promise;
  }
  ObtenerDeudaMatriculaOrdinaria(){
    let tasa = _findWhere(this.tasas,{codigo:TASA.PAGO_ORDINARIO});
    this.deudas.push(tasa);
    return tasa;
  }
  ObtenerDeudaPensionEnzenianza(){
    //TODO implementar proceso, si tiene deuda por este conceprto entonces this.deudas.push(tasa);
  }
  ObtenerDeudaPerdidaGratuidad(){
    //TODO implementar proceso de verificacion y agregar deuda si corresponde
  }
  ObtenerDeudaPerdidaGratuidad(){
    //TODO implementar proceso de verificacion y agregar deuda si corresponde
  }
  ObtenerDeudaPerdidaGratuidad(){
    //TODO implementar proceso de verificacion y agregar deuda si corresponde
  }
  ObtenerDeudaCarnetUniversitario(){
    //TODO implementar proceso de verificacion y agregar deuda si corresponde
  }
  ObtenerDeudaReactualizacionMatricula(){
    //TODO implementar proceso de verificacion y agregar deuda si corresponde
  }
  generar(next){
    var self = this;
    Q
    .fcall(ObtenerMatricula)
    .then(ObtenerTasas)
    .then(ObtenerDeudaMatriculaOrdinaria)
    .then(ObtenerDeudaPensionEnzenianza)
    .then(ObtenerDeudaPerdidaGratuidad)
    .then(ObtenerDeudaReactualizacionMatricula)
    .then(ObtenerDeudaCursosRepetidos)
    .then(ObtenerRecargoExtemporanea)
    .then(function(){
      //TODO this.deudas contiene todos los montos que se han añadido para la cobranza de la matricula
      //TODO se debe generar el compromiso de pago
      var compromisopago = new CompromisoPago();
      compromisopago.save(function(err,compromiso){
        return next(null,compromiso)
      })

    });

  }

}

module.exports= CompromisoPagoAlumno;
