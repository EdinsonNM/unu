'use strict';
/* jshint esnext:true*/
var Alumno = require('../../../models/AlumnoModel.js');
var CompromisoPago = require('../../../models/CompromisoPagoModel.js');
var Tasa = require('../../../models/TasaModel.js');
var Matricula = require('../../../models/MatriculaModel.js');
var Periodo = require('../../../models/PeriodoModel.js');
var util = require('./compromisopago.utils');
var FichaMatricula = require('../../../models/FichaMatriculaModel.js');
var Q = require('q');
var _ = require('underscore');

const TASA={
  PAGO_ORDINARIO:'01',
  PAGO_RECARGO_EXTEMPORANEO:'02',
  PAGO_REPETICION_CURSO:'03',
  PERDIDA_GRATUIDAD:'04', //TODO se esta asumiendo que existe una tasa para este pago, agregarlo a la BD y actualizar el codigo
  PAGO_CARNET_UNIVERSITARIO:'05'//TODO se esta asumiendo que existe una tasa para este pago, agregarlo a la BD y actualizar el codigo
};
const PROCESO={
  ORDINARIO:'09',
  EXTRAORDINARIO:''
};
const MODALIDAD_INGRESO={
  SEGUNDA_CARRERA:'01' //TODO Actualizar este codigo de acuerdo a la base de datos.
};
const SITUACION={
  INGRESANTE: '01',
  REGULAR: '02',
  DESAPROBADO: '03',
  SIN_RETIRO: '04',
  CREDITOS_MENOR_PERMITIDO:'05',
  AMONESTADO:'06',
  REZAGADO:'07',
  CON_SUSPENSION:'08',
  OBSERVADO:'09',
  PRIMER_PUESTO:'10',
  REACTUALIZACION_MATRICULA:'11',
  DEPORTISTA_INACTIVO:'12'
};
const PARAMETROS={
  CREDITOS_MENOR_PERMITIDO:12,
  MINIMO_PPS_APROBATORIO:10.5
};
class CompromisoPagoAlumno{
  constructor(matriculaId){
    this.matriculaId = matriculaId;
    this.deudas=[];
    this.tasas=[];
    this.matricula = {};
    this.fichamatricula = {};
  }

  ObenerPagoReactualizacionMatricula(alumno){
    var defer = Q.defer();
    //if(alumno.condicion===)
  }
  ObtenerMatricula(){
    var self = this;
    var defer = Q.defer();
    Matricula.finOne({_id:self.matriculaId})
    .populate([
      {path:'_alumno',
        populate:[
                {path:'_tipoCondicionAlumno',model:'TipoCondicionAlumno'},
                {path:'_ingresante',model:'Ingresante',
                  populate:{path:'_modalidad',model: 'ModalidadIngreso'}
                }
      ]},
      {path:'_detalleMatricula'},
      {path:'_periodo',populate:{path:'procesos._proceso',model:'Proceso'}}
    ])
    .exec(function(err,matricula){
      if(err) return defer.reject({message:'Error interno del servidor',detail:err,status:500});
      if(!matricula) return defer.reject({message:'Matricula no encontrada',detail:err,status:404});
      self.matricula = matricula;
      //SE SACA LA FICHA DE MATRICULA DEL ALUMNO
      FichaMatricula.findOne({_alumno:matricula._id},function(err,objFichaMatricula){
        self.fichamatricula = objFichaMatricula;
      });

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
    let tasa = _.findWhere(this.tasas,{codigo:TASA.PAGO_ORDINARIO});
    this.deudas.push(tasa);
    return tasa;
  }
  ObtenerDeudaPerdidaGratuidad(){
    var self = this;
    let modalidad = self.matricula._alumno._ingresante_modalidad.codigo;
    let condicion = self.matricula._alumno._tipoCondicionAlumno.codigo;
    let tasa = _.findWhere(self.tasas,{codigo:TASA.PERDIDA_GRATUIDAD});
    if(modalidad == MODALIDAD_INGRESO.SEGUNDA_CARRERA){
      self.deudas.push(tasa);
    }else if(self.matricula.totalCreditos < PARAMETROS.CREDITOS_MENOR_PERMITIDO){
      self.deudas.push(tasa);
    }else if (self.fichamatricula.numeroCursosRepetidos > 0){  //NOTE DeudaCursosRepetidos preguntar si tiene cursos repetidos. -> SE SACARA DE LA FICHA DE MATRICULA
      self.deudas.push(tasa);
    }else if (self.fichamatricula.promedioPonderadoPeriodoAnterior > PARAMETROS.MINIMO_PPS_APROBATORIO){  //NOTE ponderado semestral menor a 10.5
      self.deudas.push(tasa);
    }else{
      //TODO Consultar si las tasas son diferentes por observado, rezagado, y los demas estados....
      switch(condicion){
        case SITUACION.OBSERVADO:
        case SITUACION.REZAGADO:
        case SITUACION.DESAPROBADO:
        case SITUACION.SIN_RETIRO:
        case SITUACION.CREDITOS_MENOR_PERMITIDO:
        case SITUACION.AMONESTADO:
        case SITUACION.CON_SUSPENSION:
        case SITUACION.REACTUALIZACION_MATRICULA:  //TODO CONSULTAR LA LOGICA DE NEGOCIO Y COMPLETAR LA FUNCION DE SER NECESARIO.
        case SITUACION.DEPORTISTA_INACTIVO:
        case SITUACION.OBSERVADO: self.deudas.push(tasa); break;
      }
    }
    return tasa;
  }
  ObtenerDeudaCarnetUniversitario(){
    var self = this;
    let tasa = _.findWhere(self.tasas,{codigo:TASA.PAGO_CARNET_UNIVERSITARIO});
    self.deudas.push(tasa);
    return tasa;
    //TODO DETERMINAR EN EL MODELO COMO SE CONTROL PARA EL COBRO DE CARNET DADO QUE ES ANUAL y APLICAR EL FILTRO.
  }
  ObtenerDeudaReactualizacionMatricula(){
    //TODO implementar proceso de verificacion y agregar deuda si corresponde
  }
  ObtenerRecargoExtemporanea(){
    //TODO implementar proceso de verificacion y agregar deuda si corresponde
    var self = this;
    let fechaHoy = new Date();
    let procesoMatricula = _.findWhere(self.matricula._periodo.procesos,{codigo:"09"});
    let fechaDesde = procesoMatricula.createdAt;
    let fechaHasta = procesoMatricula.updatedAt;
    let tasa = _.findWhere(self.tasas,{codigo:TASA.PAGO_RECARGO_EXTEMPORANEO});
    if(fechaHoy > fechaHasta){
      self.deudas.push(tasa);
    }
  }
  generar(next){
    var self = this;
    Q
    .fcall(self.ObtenerMatricula())
    .then(self.ObtenerTasas())
    .then(self.ObtenerDeudaMatriculaOrdinaria())
    .then(self.ObtenerDeudaPerdidaGratuidad())
    .then(self.ObtenerDeudaCarnetUniversitario())
    .then(self.ObtenerRecargoExtemporanea())
    .then(function(){
      //TODO this.deudas contiene todos los montos que se han añadido para la cobranza de la matricula
      //TODO se debe generar el compromiso de pago
      var compromisopago = new CompromisoPago();
      compromisopago.save(function(err,compromiso){
        return next(null,compromiso);
      });

    });

  }

}

module.exports= CompromisoPagoAlumno;
