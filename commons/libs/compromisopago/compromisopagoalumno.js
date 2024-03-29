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
  MATRICULA_ORDINARIA:'01',
  PERDIDA_GRATUIDAD:'04',
  PAGO_REPETICION_CURSO:'05'
};
const PROCESO={
  REGULAR:'09',
  EXTEMPORANEO:'24'
};
const MODALIDAD_INGRESO={
  EXAMEN_ORDINARIO:'01', //TODO Actualizar este codigo de acuerdo a la base de datos.
  PRIMER_PUESTO_COLEGIO: '02',
  INGRESO_DIRECTO_CEPREUNU:'03',
  EXAMEN_COMPLEMENTARIO:'16'
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


  obtenerMatricula(){
    var self = this;
    var defer = Q.defer();
    Matricula.findOne({_id:self.matriculaId})
    .populate([
      {
        path:'_alumno',
        populate:[
                {path:'_situacionAlumno',model:'SituacionAlumno'},
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
      if(!matricula) return defer.reject({message:'Matricula no encontrada',detail:null,status:404});
      self.matricula = matricula;
      return defer.resolve(matricula);
    });
    return defer.promise;
  }
  obtenerNumeroCursosRepetidos(){
    var defer = Q.defer();
    var self = this;
    FichaMatricula.findOne({_alumno:self.matricula._alumno._id,_periodo:self.matricula._periodo._id})
    .populate([{path:'_detalles',populate:{path:'_planEstudiosDetalle',model:'Planestudiodetalle'}}])
    .exec(function(err,fichaMatricula){
      if(err) return defer.reject({message:'Error interno del servidor',detail:err,status:500});
      if(!fichaMatricula) return defer.reject({message:'No se encontro la ficha de matricula',status:404});
      self.fichamatricula = fichaMatricula;
      let listaCursosRepetidos = _.filter(self.fichamatricula._detalles,function(elemento){
        return elemento.numeroVeces > 0;
      });
      self.matricula._detalleMatricula.forEach(function(item){
        let iddetalle = item._grupoCurso._cursoAperturadoPeriodo._planestudiodetalle._id;
        let repetido = _.find(listaCursosRepetidos,function(cursoRepetido){
          return cursoRepetido._planEstudiosDetalle._id.toString() === iddetalle.toString();
        });
        if(repetido){
          self.numeroCursosRepetidos +=1;
        }
      });
      return defer.resolve(self.numeroCursosRepetidos);

    });
    return defer.promise;
  }
  obtenerTasas(){
    var self = this;
    var defer = Q.defer();
    Tasa.find({},function(err,tasas){
      if(err) return defer.reject({message:'Error interno del servidor',detail:err,status:500});
      self.tasas = tasas;
      return defer.resolve(tasas);
    });
    return defer.promise;
  }

  ObtenerDeudaOrdinaria(){
    var tasa,self=this;
    tasa = _.findWhere(this.tasas,{codigo:TASA.MATRICULA_ORDINARIA});
    if(!tasa) throw {message:'No se encontro tasa ordinaria',status:500};
    let valorTasa = _.findWhere(tasa.historial,{activo:true});
    self.deudas.push({tasa:tasa,monto:valorTasa.importe,activo:true});
    self.deudaTotal=self.deudaTotal + valorTasa.importe;
    return self.deudaTotal;
  }
  obtenerDeudaMatriculaOrdinaria(){
    let self = this;
    let modalidad;
    if(self.matricula._alumno._doc.hasOwnProperty('_modalidadIngreso') ){
      modalidad = self.matricula._alumno._modalidadIngreso.codigo;
      switch (modalidad) {
        case MODALIDAD_INGRESO.EXAMEN_ORDINARIO:
        case MODALIDAD_INGRESO.PRIMER_PUESTO_COLEGIO:
        case MODALIDAD_INGRESO.INGRESO_DIRECTO_CEPREUNU:
        case MODALIDAD_INGRESO.EXAMEN_COMPLEMENTARIO:
          self.ObtenerDeudaOrdinaria();
          return true;
        default:
          throw {message:'Modalidad de ingreso no contemplada',status:400};
      }
    }else{
      throw({message:'Alumno no contiene asignada una modalidad de ingreso',status:400});
    }

  }
  obtenerDeudaCursosRepetidos(){
    var self = this;
    let tasa = _.findWhere(self.tasas,{codigo:TASA.PAGO_REPETICION_CURSO});
    if(!tasa) throw {message:'No se encontro tasa para repetición de curso',status:500};
    if (self.numeroCursosRepetidos > 0){  //NOTE DeudaCursosRepetidos preguntar si tiene cursos repetidos. -> SE SACARA DE LA FICHA DE MATRICULA
      let valorTasa = _.findWhere(tasa.historial,{activo:true});
      self.deudas.push({tasa:tasa,monto:valorTasa.importe*self.numeroCursosRepetidos,activo:true});
      self.deudaTotal=self.deudaTotal + valorTasa.importe*self.numeroCursosRepetidos;
    }
    return tasa;
  }

  obtenerSituacionAlumno(){
    let self = this;
    let situacion;
    if(self.matricula._alumno._situacionAlumno.codigo===SITUACION.REZAGADO) return SITUACION.REZAGADO;
    if(self.fichamatricula.promedioPonderadoPeriodoAnterior<=10.5) return SITUACION.OBSERVADO;
    if(self.matricula._alumno._situacionAlumno.codigo===SITUACION.REINGRESANTE) return SITUACION.REINGRESANTE;
    return 0;
  }
  obtenerDeudaPerdidaGratuidad(){
    var self = this;
    let tasa = {};
    let valorTasa={};
    let situacion = self.obtenerSituacionAlumno();
    //TODO Consultar si las tasas son diferentes por observado, rezagado, y los demas estados....
    switch(situacion){
      case SITUACION.OBSERVADO:
      case SITUACION.REZAGADO:
      case SITUACION.REINGRESANTE:
        tasa = _.findWhere(self.tasas,{codigo:TASA.PERDIDA_GRATUIDAD});
        if(!tasa) throw {message:'No se encontro tasa para perdida de gratuidad',status:500};
        valorTasa = _.findWhere(tasa.historial,{activo:true});
        self.deudas.push({tasa:tasa,monto:valorTasa.importe,activo:true});
        self.deudaTotal=self.deudaTotal + valorTasa.importe;
        break;
    }
  }

  ValidarProcesos(){
    let self = this;
    let procesoOrdinario = _.find(self.matricula._periodo.procesos,function(item){ return item._proceso.codigo===PROCESO.REGULAR;});
    //let procesoOrdinario = _.findWhere(self.matricula._periodo.procesos,{codigo:PROCESO.EXTEMPORANEO});
    //if(!procesoOrdinario) throw {message:'EL proceso de matricula ordinario no se ha definido para el periodo seleccionado',status:500};
    return true;
  }

  ValidarExistenciaCompromiso(){
    var self = this;
    var defer = Q.defer();
    let tasa = _.findWhere(self.tasas,{codigo:TASA.MATRICULA_ORDINARIA});
    if(!tasa) throw {message:'No se encontro tasa ordinaria',status:500};
    CompromisoPago.findOne({
      //codigo:self.matricula._alumno.codigo,
      _periodo:self.matricula._periodo._id,
      _persona:self.matricula._alumno._persona,
      _tasa:tasa._id,
      estado:{$in:['Activo','Inactivo']}
    },function(err,compromiso){
      if(err) return defer.reject({message:'Error interno del servidor',detail:err,status:500});
      if(compromiso) return defer.reject({message:'EL pago no se ha generado porque ya existe un compromiso registrado',status:412,detail:compromiso});
      return defer.resolve(true);
    });
    return defer.promise;
  }

  generarCompromiso(){
    var defer = Q.defer();
    let self = this;
    let tasa = _.findWhere(self.tasas,{codigo:TASA.MATRICULA_ORDINARIA});
    if(!tasa) throw {message:'No se encontro tasa ordinaria',status:500};

    let fechaVencimiento = moment().add(2, 'days');

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

    self.matricula.estado="Prematricula";
    self.matricula.save(function(err,data){
      if(err) return defer.reject({message:'Error interno del servidor',detail:err,status:500});
      compromisopago.save(function(err,compromiso){
        if(err) return defer.reject({message:'Error interno del servidor',detail:err,status:500});
        return defer.resolve(compromiso);
      });
    });

    return defer.promise;
  }

  matricularIngresante(){
    var defer = Q.defer();
    let self = this;
    self.matricula.estado="Matriculado";
    self.matricula.save(function(err,data){
      if(err) return defer.reject({message:'Error interno del servidor',detail:err,status:500});
      return defer.resolve({matricula:data});
    });
    return defer.promise;
  }
  validarMatriculaAlumno(){
    var self = this;
    let promises = [];
    let disponibilidad = true;
    let defer = Q.defer();
    if(self.matricula._detalleMatricula.length===0) return defer.reject({message:'Debe agregar uno o mas cursos a la matricula',status:400});
    var SaveDetalle = function(item){
      let deferItem = Q.defer();
      item.save(function(err,data){
        if(err) return deferItem.reject(err);
        return deferItem.resolve(data);
      });
      return deferItem.promise;
    };
    self.matricula._detalleMatricula.forEach(function(item,index){
      if(item._grupoCurso.totalCupos<=item._grupoCurso.matriculados){
        disponibilidad = false;
        item.estado = 'SinCupo';
        promises.push(SaveDetalle(item));
      }
    });
    if(!disponibilidad){
      Q.all(promises).then(function(result){
        return defer.reject({message:'Uno o mas cursos no tienen disponibilidad',status:400});
      });
    }else{
      var promisesGrupos = [];
      var SaveGrupo = function(item){
        let deferItem = Q.defer();
        item._grupoCurso.save(function(err,data){
          if(err) return deferItem.reject(err);
          return deferItem.resolve(data);
        });
        return deferItem.promise;
      };
      self.matricula._detalleMatricula.forEach(function(item,index){
        item._grupoCurso.matriculados = item._grupoCurso.matriculados+1;
        promisesGrupos.push(SaveGrupo(item));
      });
      Q.all(promisesGrupos).then(function(result){
        return defer.resolve(true);
      });

    }
    return defer.promise;
  }

  generarAlumno(next){
    var self = this;
    Q
    .fcall(self.obtenerTasas.bind(this))
    //.then(self.obtenerMatricula.bind(this))
    .then(self.ValidarProcesos.bind(this))
    .then(self.validarMatriculaAlumno.bind(this))
    .then(self.obtenerNumeroCursosRepetidos.bind(this))
    .then(self.ValidarExistenciaCompromiso.bind(this))
    .then(self.obtenerDeudaMatriculaOrdinaria.bind(this))
    .then(self.obtenerDeudaCursosRepetidos.bind(this))
    .then(self.obtenerDeudaPerdidaGratuidad.bind(this))
    .then(self.generarCompromiso.bind(this))
    .then(function(compromiso){
      return next(null,compromiso);
    })
    .catch(function(error){
      return next(error);
    })
    .done();
  }

  generarCompromisoRecalculo(next){
    var self = this;
    Q
    .fcall(self.obtenerMatricula.bind(this))
    .then(self.obtenerTasas.bind(this))
    .then(self.ValidarProcesos.bind(this))
    .then(self.obtenerNumeroCursosRepetidos.bind(this))
    .then(self.ValidarExistenciaCompromiso.bind(this))
    .then(self.obtenerDeudaMatriculaOrdinaria.bind(this))
    .then(self.obtenerDeudaCursosRepetidos.bind(this))
    .then(self.obtenerDeudaPerdidaGratuidad.bind(this))
    .then(self.generarCompromiso.bind(this))
    .then(function(compromiso){
      return next(null,compromiso);
    })
    .catch(function(error){
      return next(error);
    })
    .done();
  }

  generarIngresante(next){
    var self = this;
    Q
    .fcall(self.validarMatriculaAlumno.bind(this))
    .then(self.matricularIngresante.bind(this))
    .then(function(result){
      return next(null,result);
    })
    .catch(function(error){
      return next(error);
    })
    .done();
  }

  generar(next){
    var self = this;
    Q
    .fcall(self.obtenerMatricula.bind(this))
    .then(function(result){
      if(self.matricula._alumno._periodoInicio.toString() === self.matricula._periodo._id.toString()){
        self.generarIngresante(next);
        }else{
        self.generarAlumno(next);
        }
      })
    .catch(function(error){
      return next(error);
    })
    .done();
  }
}

module.exports= CompromisoPagoAlumno;
