/* jshint esnext:true*/
var Ingresante = require('../../models/IngresanteModel.js');
var Alumno = require('../../models/AlumnoModel.js');
var CompromisoPago = require('../../models/CompromisoPagoModel.js');
//var Periodo = require('../../models/PeriodoModel.js');/*
const PARTICULAR=06;
const ESTATAL=05;

class CompromisoIngresante{
  constructor(periodo){
    this.periodo = periodo;
    this.ingresantes = [];
  }
  generar(next){
    let self = this;
    Ingresante.find({
      estado:'Aprobado',
      _periodo:this.periodo
    })
    .populate('modalidad')
    .populate('_persona')
    .exec(function(err,ingresantes){
      if(err) return next(err);
      if(!ingresantes) return next(null,{status:204,message:'No existen registros por procesar'});
      self.ingresantes = ingresantes;
      self.ingresantes.forEach(function(ingresante){
        switch (ingresante._tipoColegio.codigo) {
          case PARTICULAR:
            Tasa.find();
            break;
          case ESTATAL:
            break;
          default:

        }
      let objCompromiso={
        _periodo: self.periodo,
        _persona:ingresante._persona._id,
        codigoPago: '00'+ingresante._persona.dni
      };
      let compromiso = new CompromisoPago(objCompromiso);
      compromiso.save();
      });
    });
  }
}

module.exports.generar = function generar(tipo,periodo,next){
  //let compromiso;
  switch (tipo) {
    case 'ingresante':
        var compromiso = new CompromisoIngresante(periodo);
      break;
    default:
      next({status:404,message:'No se encontro el tipo de proceso para generar los compromisos de pago'});
  }
  compromiso.generar(next);
};
