var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');

var CompromisopagoSchema = new Schema({
    _periodo:{
      type:Schema.Types.ObjectId,
      ref:'Periodo',
      required:true
    },
    _persona:{
      type:Schema.Types.ObjectId,
      ref:'Persona',
      required:true
    },
    _tasa:{
      type:Schema.Types.ObjectId,
      ref:'Tasa',
      required:true
    },
    _identificador:{//PARA LAS DEUDAS GENERALES QUE PUEDEN SER MULTIPLES PERO QUE EL DEUDOR AL MOMENTO DE PAGAR PUEDE ESCOGER CUALES PAGAR COMO LOS EXAMENES SUSTITUTORIOS -> IRIA EN EL CAMPO "Campo de Identificación Adicional" DEL ARCHIVO DE ENTRADA AL BANCO
      type: Number,
      required:true,
      default:1
    },
    _detallePago:[
      {
        nroMovimiento:Number,
        fechaPago:Date,
        totalPagado:Number,
        montoPago:Number,
        montoMora:Number,
        oficinaPago:String,
        institucion:String,//[OPCIONAL]
        fechaImportacion:Date//FECHA EN LA QUE SE REALIZO LA IMPORTACION DE LOS PAGOS
      }
    ],
    descripcion:{//PODRIA TOMARSE COMO EL IDENTIFICADOR
      type:String,
  		required:true
    },
    pagado:{
      type:Boolean,
  		required:true,
      default:false
    },
    importeTotal:{
      type:Number,
      required:true,
      default:0
    },
    importeTotalPagado:{
      type:Number,
      required:true,
      default:0
    },
    createdAt:Date,
  	updatedAt:Date
});
CompromisopagoSchema.pre('save',function(next){
	var now = new Date();
	this.updatedAt = now;
	if (!this.createdAt){
		this.createdAt=now;
	}
	next();
});
CompromisopagoSchema.plugin(mongoosePaginate);
CompromisopagoSchema.plugin(uniqueValidator);
module.exports = mongoose.model('CompromisoPago', CompromisopagoSchema).plural('CompromisoPago');
