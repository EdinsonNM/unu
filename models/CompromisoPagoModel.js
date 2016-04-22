var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');

var CompromisopagoSchema = new Schema({

    codigo:{//00+DNI => Para INGRESANTES | CODIGOUNIVERSITARIO => ALUMNOS
      type:String,
      required:true
    },
    referenciAlumno:{//SE ACTUALIZA CUANDO EL INGRESANTE SE CONVIERTE EN ALUMNO, ES EL CODIGOUNIVERSITARIO
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
    saldoFavor:{
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
    detalleDeuda:[{
      tasa:{
        type:Schema.Types.ObjectId,
        ref:'Tasa',
        required:false
      },
      monto:Number,
      activo:Boolean
    }
    ],
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
    },
    /*NOTE: El estado Desetimado signfica que al final del proceso de matricula será eliminado dado que fue un comprobante temporal*/
    estado:{
      type:String,
      enum:['Activo','Inactivo','Desestimado','Anulado'],
      default:'Activo'
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
    montoTotalPagado += this.detallePago[i].montoPago;
    montoTotalMora += this.detallePago[i].montoMora;
  }
  this.moratotal = montoTotalMora;
  this.saldo = (totalDeuda - montoTotalPagado <= 0)?0:totalDeuda - montoTotalPagado;
  this.saldoFavor = (totalDeuda - montoTotalPagado < 0)?(montoTotalPagado-totalDeuda):0;
  this.pagado = (totalDeuda - montoTotalPagado <= 0)?true:false;
	next();
});

CompromisopagoSchema.plugin(mongoosePaginate);
CompromisopagoSchema.plugin(uniqueValidator);
module.exports = mongoose.model('CompromisoPago', CompromisopagoSchema).plural('compromisopagos');
