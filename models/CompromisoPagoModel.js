var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');

var CompromisopagoSchema = new Schema({

    codigo:{//un simple correlativo como identificador del compromiso
      type:Number,
      required:true
    },
    referenciAlumno:{//un simple correlativo como identificador del compromiso
      type:Number,
      required:true
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
      required:true,
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
          required:true
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
	next();
});
CompromisopagoSchema.plugin(mongoosePaginate);
CompromisopagoSchema.plugin(uniqueValidator);
module.exports = mongoose.model('CompromisoPago', CompromisopagoSchema).plural('compromisopagos');
