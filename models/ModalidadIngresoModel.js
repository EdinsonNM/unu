var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
//CEPRE,Examen Ordinario,
var ModalidadIngresoSchema = new Schema({
  codigo: {
    type: String,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: ['General','Carrera'],
    required: true
  },
  created_at: Date,
  updated_at: Date
});
ModalidadIngresoSchema.plugin(mongoosePaginate);
ModalidadIngresoSchema.plugin(uniqueValidator);
ModalidadIngresoSchema.pre('save', function(next) {
  var now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

module.exports = mongoose.model('ModalidadIngreso', ModalidadIngresoSchema).plural('modalidadingreso');
