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
    createdAt: Date,
    monto:Number,
    codigoOperacion:String,
    tipo:{
      type:String,
      enum:['manual','automatico']
    }
  }],

  createdAt: Date,
  updatedAt: Date
});
RegistroPagoSchema.plugin(mongoosePaginate);
RegistroPagoSchema.plugin(uniqueValidator);
RegistroPagoSchema.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('RegistroPago', RegistroPagoSchema).plural('registropagos');
