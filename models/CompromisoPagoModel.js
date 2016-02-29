var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');

var CompromisopagoSchema = new Schema({

    codigo:{//un simple correlativo como identificador del compromiso
      type:String,
      required:true
    },
    referenciAlumno:{//un simple correlativo como identificador del compromiso
      type:String
    },
    pagado:{
      type:Boolean,
      required:true,
      default:false
    },
    importe:{
      type:Number,
      required:true,
      default:0
    },
    saldo:{
      type:Number,
      required:true,
      default:0
    },
    moratotal:{
      type:Number,
      default:0
    },
    fechavenc:Date,
    createdAt:Date,
    updatedAt:Date,
    detallePago:[
      {
        nroMovimiento:Number,
        fechaPago:Date,
        totalPagado:Number,
        montoPago:Number,
        montoMora:Number,
        oficinaPago:String,
        institucion:String,//[OPCIONAL]
        cuenta:String,
        fechaImportacion:Date,//FECHA EN LA QUE SE REALIZO LA IMPORTACION DE LOS PAGOS
        _archivobanco:{
          type:Schema.Types.ObjectId,
          ref:'ArchivoBanco',
          required:false
        }
      }
    ],
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
    }
});

CompromisopagoSchema.pre('save',function(next){
	var now = new Date();
	this.updatedAt = now;
	if (!this.createdAt){
		this.createdAt=now;
	}
  //TODO recorrido de los detalles para el calculo de los totales y saldos
  var montoTotalPagado = 0, montoTotalMora = 0, totalDeuda = 0;
  totalDeuda = this.importe;
  for (var i = 0; i < this.detallePago.length; i++) {
    montoTotalPagado = this.detallePago[i].montoPago;
    montoTotalMora = this.detallePago[i].montoMora;
  }
  this.moratotal = montoTotalMora;
  this.saldo = (totalDeuda - montoTotalPagado <= 0)?0:totalDeuda - montoTotalPagado;
  this.pagado = (totalDeuda - montoTotalPagado <= 0)?true:false;
	next();
});
CompromisopagoSchema.plugin(mongoosePaginate);
CompromisopagoSchema.plugin(uniqueValidator);
module.exports = mongoose.model('CompromisoPago', CompromisopagoSchema).plural('compromisopagos');
