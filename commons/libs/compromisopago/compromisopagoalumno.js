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
var moment = require('moment');
const TASA={
  PAGO_ORDINARIO:'01',
  SEGUNDA_CARRERA:'04',
  PENSION_SEMESTRE_SEGUNDA_CARRERA:'05',
  EXONERACION_MATRICULA:'06',
  AVANCE_CURRICULAR:'07',
  OBSERVADO:'08',
  REZAGADO:'09',
  REINGRESANTE:'10',
  DESAPROBADO_PROMEDIO_APROBADO:'11',
  PAGO_RECARGO_EXTEMPORANEO:'12',
  PAGO_REPETICION_CURSO:'13',
  PAGO_CARNET_UNIVERSITARIO:'14'
};
const PROCESO={
  REGULAR:'09',
  EXTEMPORANEO:'24'
};
const MODALIDAD_INGRESO={
  SEGUNDA_CARRERA:'01', //TODO Actualizar este codigo de acuerdo a la base de datos.
  VIOLENCIA_POLITICA: '02',
  COMUNIDAD_NATIVA:'03',
  MINEDU:'04',
  DISCAPACITADO:'05',
  DEPORTISTA:'06'
};
const SITUACION={
  INGRESANTE: '01',
  REGULAR: '02',
  DESAPROBADO: '03',
  SIN_RETIRO: '04',
  CREDITOS_MENOR_PERMITIDO:'05',
  AMONESTADO:'06',
  CON_SUSPENSION:'08',
  OBSERVADO:'08',
  REZAGADO:'09',
  REINGRESANTE:'10',
  PRIMEROS_PUESTOS:'10',
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
    Matricula.findOne({_id:self.matriculaId})
    .populate([
      {
        path:'_alumno',
        populate:[
                {path:'_tipoCondicionAlumno',model:'TipoCondicionAlumno'},
                {path:'_modalidadIngreso',model: 'ModalidadIngreso'}
      ]},
      {
        path:'_detalleMatricula',
        populate:[
          {
            path:'_grupoCurso',
            model:'GrupoCurso',
            populate:[
              {
                path:'_cursoAperturadoPeriodo',
                model:'CursoAperturadoPeriodo',
                populate:{
                  path:'_planestudiodetalle',
                  model:'Planestudiodetalle'
                }
              }
            ]
          }
        ]
      },
      {path:'_periodo',populate:{path:'procesos._proceso',model:'Proceso'}}
    ])
    .exec(function(err,matricula){
      if(err) return defer.reject({message:'Error interno del servidor',detail:err,status:500});
      if(!matricula) return defer.reject({message:'Matricula no encontrada',detail:err,status:404});
      self.matricula = matricula;
      return defer.resolve(matricula);
    });
    return defer.promise;
  }
  ObtenerNumeroCursosRepetidos(matricula){
    var defer = Q.defer();
    var self = this;
    FichaMatricula.findOne({_alumno:matricula._alumno._id,_periodo:matricula._periodo._id})
    .populate([{path:'_detalles',populate:{path:'_planEstudiosDetalle',model:'Planestudiodetalle'}}])
    .exec(function(err,fichaMatricula){
      if(err) return defer.reject(err);
      self.fichamatricula = fichaMatricula;
      let listaCursosRepetidos = _.filter(self.fichamatricula._detalles,function(elemento){ return elemento.numeroVeces > 0;});
      matricula._detalleMatricula.forEach(function(item){
        let iddetalle = item._grupoCurso._cursoAperturadoPeriodo._planestudiodetalle._id;
        let repetido = _.find(listaCursosRepetidos,function(cursoRepetido){
          return cursoRepetido._planEstudiosDetalle._id === iddetalle;
        });
        if(repetido){
          self.numeroCursosRepetidos +=1;
        }
      });
      defer.resolve(self.numeroCursosRepetidos);

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
  ObetenerDeudaSegundaCarrera(){
    var tasa,self=this;
    tasa = _.findWhere(self.tasas,{codigo:TASA.SEGUNDA_CARRERA});
    let valorTasa = _.findWhere(tasa.historial,{activo:true});
    self.deudas.push({tasa:tasa,monto:valorTasa.importe,activo:true});
    self.deudaTotal=self.deudaTotal + valorTasa.importe;
    tasa = _.findWhere(self.tasas,{codigo:TASA.PENSION_SEMESTRE_SEGUNDA_CARRERA});
    valorTasa = _.findWhere(tasa.historial,{activo:true});
    self.deudas.push({tasa:tasa,monto:valorTasa.importe,activo:true});
    self.deudaTotal=self.deudaTotal + valorTasa.importe;
  }
  ObtenerDeudaExoneracion(){
    var tasa,self=this;
    if(self.matricula._alumno.educacionGratuita){
      tasa = _.findWhere(this.tasas,{codigo:TASA.EXONERACION_MATRICULA});
    }
    else{
      tasa = _.findWhere(this.tasas,{codigo:TASA.PAGO_ORDINARIO});
    }
    let valorTasa = _.findWhere(tasa.historial,{activo:true});
    self.deudas.push({tasa:tasa,monto:valorTasa.importe,activo:true});
    self.deudaTotal=self.deudaTotal + valorTasa.importe;
  }
  ObtenerDeudaOrdinaria(){
    var tasa,self=this;
    tasa = _.findWhere(this.tasas,{codigo:TASA.PAGO_ORDINARIO});
    let valorTasa = _.findWhere(tasa.historial,{activo:true});
    self.deudas.push({tasa:tasa,monto:valorTasa.importe,activo:true});
    self.deudaTotal=self.deudaTotal + valorTasa.importe;
  }
  ObtenerDeudaMatriculaOrdinaria(){
    var self = this;
    let tasa={};
    let modalidad = '99';//self.matricula._alumno._modalidadIngreso.codigo;
    switch (modalidad) {
      case MODALIDAD_INGRESO.VIOLENCIA_POLITICA:
      case MODALIDAD_INGRESO.COMUNIDAD_NATIVA:
      case MODALIDAD_INGRESO.MINEDU:
      case MODALIDAD_INGRESO.DISCAPACITADO:
      case MODALIDAD_INGRESO.DEPORTISTA:
          self.ObtenerDeudaExoneracion();
        break;
      case MODALIDAD_INGRESO.SEGUNDA_CARRERA:
        self.ObetenerDeudaSegundaCarrera();
        break;
      default:
        let condicion = self.matricula._alumno._tipoCondicionAlumno.codigo;
        if(condicion === SITUACION.PRIMEROS_PUESTOS){
          self.ObtenerDeudaExoneracion();
        }else{
          self.ObtenerDeudaOrdinaria();
        }
    }
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
    /*var self = this;
    let condicion = self.matricula._alumno._tipoCondicionAlumno.codigo;
    if(self.matricula.totalCreditos < PARAMETROS.CREDITOS_MENOR_PERMITIDO){
      let tasa = _.findWhere(self.tasas,{codigo:TASA.CREDITOS_MENOR_PERMITIDO});
      let valorTasa = _.findWhere(tasa.historial,{activo:true});
      self.deudas.push({tasa:tasa,monto:valorTasa.importe,activo:true});
      self.deudaTotal=self.deudaTotal + valorTasa.importe;
    }*/
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
    case SITUACION.REINGRESANTE: tasa = _.findWhere(self.tasas,{codigo:TASA.REINGRESANTE}); break;  //TODO CONSULTAR LA LOGICA DE NEGOCIO Y COMPLETAR LA FUNCION DE SER NECESARIO.
    default: return;
    }
    valorTasa = _.findWhere(tasa.historial,{activo:true});
    self.deudas.push({tasa:tasa,monto:valorTasa.importe,activo:true});
    self.deudaTotal=self.deudaTotal + valorTasa.importe;

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
    let procesoMatricula = _.findWhere(self.matricula._periodo.procesos,{codigo:PROCESO.REGULAR});
    return;
    let fechaDesde = procesoMatricula.fechaInicio;
    let fechaHasta = procesoMatricula.fechaFin;
    let tasa = _.findWhere(self.tasas,{codigo:TASA.PAGO_RECARGO_EXTEMPORANEO});
    if(fechaHoy > fechaHasta){
      let valorTasa = _.findWhere(tasa.historial,{activo:true});
      self.deudas.push({tasa:tasa,monto:valorTasa.importe,activo:true});
      self.deudaTotal=self.deudaTotal + valorTasa.importe;
    }
  }


  generar(next){
    var self = this;
    self.next = next;
    Q
    .fcall(self.ObtenerTasas.bind(this))
    .then(self.ObtenerMatricula.bind(this))
    .then(self.ObtenerNumeroCursosRepetidos.bind(this))
    .then(self.ObtenerDeudaMatriculaOrdinaria.bind(this))
    .then(self.ObtenerDeudaCursosRepetidos.bind(this))
    .then(self.ObtenerDeudaCreditosMenorPermitido.bind(this))
    .then(self.ObtenerDeudaPerdidaGratuidad.bind(this))
    .then(self.ObtenerDeudaCarnetUniversitario.bind(this))
    //.then(self.ObtenerRecargoExtemporanea.bind(this))
    .then(function(){
      console.log("Se agregaron todas las deudas...");
      //TODO this.deudas contiene todos los montos que se han añadido para la cobranza de la matricula
      //TODO se debe generar el compromiso de pago

      var tasa = _.findWhere(self.tasas,{codigo:TASA.PAGO_ORDINARIO});

      let procesoMatricula = _.findWhere(self.matricula._periodo.procesos,{codigo:PROCESO.REGULAR});
      console.log('procesoMatricula');
      let fechaVencimiento = moment().add(2, 'days');
      console.log('fechaVencimiento',fechaVencimiento);
      console.log('new compromiso',self.matricula);
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
      console.log('end compromiso');
      console.log(compromisopago);
      self.matricula.estado="Prematriculado";
      self.matricula.save(function(err,data){
        console.log(err);
        if(err) return self.next(err);
        compromisopago.save(function(err,compromiso){
          if(err) return self.next(err);
          console.log('se genero el compromiso');
          return self.next(null,compromiso);
        });
      }).done();

    });
  }
}

module.exports= CompromisoPagoAlumno;
