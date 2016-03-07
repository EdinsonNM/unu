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
  PAGO_CARNET_UNIVERSITARIO:'05',//TODO se esta asumiendo que existe una tasa para este pago, agregarlo a la BD y actualizar el codigo
  SEGUNDA_CARRERA:'06', //TODO se esta asumiendo que existe una tasa para este pago, agregarlo a la BD y actualizar el codigo
  PENSION_SEMESTRE:'07',
  CREDITOS_MENOR_PERMITIDO:'08',
  OBSERVADO:'09',
  REZAGADO:'10',
  SIN_RETIRO:'11',
  AMONESTADO:'12',
  CON_SUSPENSION:'13',
  REACTUALIZACION_MATRICULA:'14',
  EXONERACION_MATRICULA:'15'
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
  PRIMEROS_PUESTOS:'10',
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
    this.deudas=[];//{tasa,valor,activo}
    this.tasas=[];
    this.matricula = {};
    this.fichamatricula = {};
    this.numeroCursosRepetidos=0;
    this.deudaTotal=0;
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
      FichaMatricula.findOne({_alumno:matricula._id})
      .populate([{path:'_detalles',model:'FichaMatriculaDetalle'}])
      .exec(function(err,objFichaMatricula){
        self.fichamatricula = objFichaMatricula;
        let listaCursosRepetidos = _.filter(self.fichamatricula._detalles,function(elemento){ return elemento.numeroVeces > 0;});
        self.numeroCursosRepetidos = listaCursosRepetidos.length;
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
    var self = this;
    let tasa={};
    let modalidad = self.matricula._alumno._ingresante_modalidad.codigo;
    if(modalidad == MODALIDAD_INGRESO.SEGUNDA_CARRERA){
      tasa = _.findWhere(self.tasas,{codigo:TASA.SEGUNDA_CARRERA});
      let valorTasa = _.findWhere(tasa.historial,{activo:true});
      self.deudas.push({tasa:tasa,monto:valorTasa.importe,activo:true});
      self.deudaTotal=self.deudaTotal + valorTasa.importe;
      tasa = _.findWhere(self.tasas,{codigo:TASA.PENSION_SEMESTRE});
      valorTasa = _.findWhere(tasa.historial,{activo:true});
      self.deudas.push({tasa:tasa,monto:valorTasa.importe,activo:true});
      self.deudaTotal=self.deudaTotal + valorTasa.importe;
    }else{
      switch (modalidad) {
        case MODALIDAD_INGRESO.VIOLENCIA_POLITICA:
        case MODALIDAD_INGRESO.COMUNIDAD_NATIVA:
        case MODALIDAD_INGRESO.MINEDU:
        case MODALIDAD_INGRESO.DISCAPACITADO:
        case MODALIDAD_INGRESO.DEPORTISTA:
          if(self.matricula._alumno.educacionGratuita){tasa = _.findWhere(this.tasas,{codigo:TASA.EXONERACION_MATRICULA});}
          else{tasa = _.findWhere(this.tasas,{codigo:TASA.PAGO_ORDINARIO});} break;
        //TODO VERIFICAR SI EXISTEN MAS MODALIDADES QUE SE EXONEREN DE MATRICULA
        default:
          let condicion = self.matricula._alumno._tipoCondicionAlumno.codigo;
          if(condicion ==SITUACION.PRIMEROS_PUESTOS && self.matricula._alumno.educacionGratuita){
            tasa = _.findWhere(this.tasas,{codigo:TASA.EXONERACION_MATRICULA});
          }else{
            tasa = _.findWhere(this.tasas,{codigo:TASA.PAGO_ORDINARIO});
          }
      }
      let valorTasa = _.findWhere(tasa.historial,{activo:true});
      self.deudas.push({tasa:tasa,monto:valorTasa.importe,activo:true});
      self.deudaTotal=self.deudaTotal + valorTasa.importe;
    }
    //return tasa;
  }
  ObtenerDeudaCursosRepetidos(){
    var self = this;
    let tasa = _.findWhere(self.tasas,{codigo:TASA.PAGO_REPETICION_CURSO});
    if (self.numeroCursosRepetidos > 0){  //NOTE DeudaCursosRepetidos preguntar si tiene cursos repetidos. -> SE SACARA DE LA FICHA DE MATRICULA
      let valorTasa = _.findWhere(tasa.historial,{activo:true});
      self.deudas.push({tasa:tasa,monto:valorTasa.importe*self.numeroCursosRepetidos,activo:true});
      self.deudaTotal=self.deudaTotal + valorTasa.importe*self.numeroCursosRepetidos;
    }
    return tasa;
  }
  ObtenerDeudaCreditosMenorPermitido(){
    var self = this;
    let condicion = self.matricula._alumno._tipoCondicionAlumno.codigo;
    if(self.matricula.totalCreditos < PARAMETROS.CREDITOS_MENOR_PERMITIDO){
      let tasa = _.findWhere(self.tasas,{codigo:TASA.CREDITOS_MENOR_PERMITIDO});
      let valorTasa = _.findWhere(tasa.historial,{activo:true});
      self.deudas.push({tasa:tasa,monto:valorTasa.importe,activo:true});
      self.deudaTotal=self.deudaTotal + valorTasa.importe;
    }
  }
  ObtenerDeudaPerdidaGratuidad(){
    var self = this;
    let condicion = self.matricula._alumno._tipoCondicionAlumno.codigo;
    let tasa = {};
    let valorTasa={};
    //TODO Consultar si las tasas son diferentes por observado, rezagado, y los demas estados....
    switch(condicion){
      case SITUACION.OBSERVADO: tasa = _.findWhere(self.tasas,{codigo:TASA.OBSERVADO}); break; //->6: ALUMNO CON PPS < 10.5
      case SITUACION.REZAGADO: tasa = _.findWhere(self.tasas,{codigo:TASA.REZAGADO}); break;//case SITUACION.DESAPROBADO: se asume que es observado por tener ponderado < 10.5
      case SITUACION.SIN_RETIRO:tasa = _.findWhere(self.tasas,{codigo:TASA.SIN_RETIRO}); break; //->9: ALUMNO CON PPS>10.5/CON CURSO DESAPROBADO O CON CURSO EN NSP (NO SE PRESENTO, SIN RETIRO)
      case SITUACION.AMONESTADO: tasa = _.findWhere(self.tasas,{codigo:TASA.AMONESTADO}); break;
      case SITUACION.CON_SUSPENSION: tasa = _.findWhere(self.tasas,{codigo:TASA.CON_SUSPENSION}); break;
      case SITUACION.REACTUALIZACION_MATRICULA: tasa = _.findWhere(self.tasas,{codigo:TASA.REACTUALIZACION_MATRICULA}); break;  //TODO CONSULTAR LA LOGICA DE NEGOCIO Y COMPLETAR LA FUNCION DE SER NECESARIO.
    }
    valorTasa = _.findWhere(tasa.historial,{activo:true});
    self.deudas.push({tasa:tasa,monto:valorTasa.importe,activo:true});
    self.deudaTotal=self.deudaTotal + valorTasa.importe;

    return tasa;
  }
  ObtenerDeudaCarnetUniversitario(){
    var self = this;
    let tasa = _.findWhere(self.tasas,{codigo:TASA.PAGO_CARNET_UNIVERSITARIO});
    let valorTasa = _.findWhere(tasa.historial,{activo:true});
    self.deudas.push({tasa:tasa,monto:valorTasa.importe,activo:true});
    self.deudaTotal=self.deudaTotal + valorTasa.importe;
    //return tasa;
    //TODO DETERMINAR EN EL MODELO COMO SE CONTROL PARA EL COBRO DE CARNET DADO QUE ES ANUAL y APLICAR EL FILTRO.
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
      let valorTasa = _.findWhere(tasa.historial,{activo:true});
      self.deudas.push({tasa:tasa,monto:valorTasa.importe,activo:true});
      self.deudaTotal=self.deudaTotal + valorTasa.importe;
    }
  }
  generar(next){
    var self = this;
    Q
    .fcall(self.ObtenerMatricula())
    .then(self.ObtenerTasas())
    .then(self.ObtenerDeudaMatriculaOrdinaria())
    .then(self.ObtenerDeudaCursosRepetidos())
    .then(self.ObtenerDeudaCreditosMenorPermitido())
    .then(self.ObtenerDeudaPerdidaGratuidad())
    .then(self.ObtenerDeudaCarnetUniversitario())
    .then(self.ObtenerRecargoExtemporanea())
    .then(function(){
      //TODO this.deudas contiene todos los montos que se han añadido para la cobranza de la matricula
      //TODO se debe generar el compromiso de pago
      var self = this;
      var tasa = _.findWhere(this.tasas,{codigo:TASA.PAGO_ORDINARIO});
      let procesoMatricula = _.findWhere(self.matricula._periodo.procesos,{codigo:"09"});
      let fechaVencimiento = procesoMatricula.updatedAt;
      var compromisopago = new CompromisoPago({
        codigo:util.pad(self.matricula._alumno.codigo,10,'0'),
        pagado:false,
        importe:self.deudaTotal,
        saldo:self.deudaTotal,
        moratotal:0,
        fechavenc:fechaVencimiento,
        detalleDeuda:self.deudas,
        detallePago:[],
        _periodo: self.matricula._periodo._id,
        _persona:self.matricula._alumno._persona,
        _tasa:tasa._id
      });
      compromisopago.save(function(err,compromiso){
        return next(null,compromiso);
      });
    });
  }
}

module.exports= CompromisoPagoAlumno;
