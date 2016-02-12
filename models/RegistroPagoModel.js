var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var RegistroPagoSchema = new Schema({
  usuario:{
    //DNI para ingresante y CodigoUniversitario para alumno
    codigo: {
      type: String,
      required: true
    },
    tipo:{
      type: String,
      enum:['ingresante','alumno'],
      required: true
    },
    _ingresante: {
      type: Schema.Types.ObjectId,
      ref: 'Ingresante',
      required: true
    },
    _alumno: {
      type: Schema.Types.ObjectId,
      ref: 'Alumno',
      required: true
    },
  },
  _conceptoPago: {
    type: Schema.Types.ObjectId,
    ref: 'Pabellon',
    required: true
  },
  _archivoEntradaBanco: {
    type: Schema.Types.ObjectId,
    ref: 'ArchivoEntradaBanco'
  },
  _periodo: {
    type: Schema.Types.ObjectId,
    ref: 'Periodo'
  },
  pagado:{
    type:Boolean,
    default:false
  },
  importeTotal:Number,
  importeTotalPagado:Number,
  detallePagos:[{
    created_at: Date,
    monto:Number,
    codigoOperacion:String,
    tipo:{
      type:String,
      enum:['manual','automatico']
    }
  }],

  created_at: Date,
  updated_at: Date
});
RegistroPagoSchema.plugin(mongoosePaginate);
RegistroPagoSchema.plugin(uniqueValidator);
RegistroPagoSchema.pre('save', function(next) {
  var now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

module.exports = mongoose.model('RegistroPago', RegistroPagoSchema).plural('registropagos');
