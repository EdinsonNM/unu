var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
//CEPRE,Examen Ordinario,
var DocumentoIngresanteSchema = new Schema({
  codigo: {
    type: String,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  createdAt: Date,
  updatedAt: Date
});
DocumentoIngresanteSchema.plugin(mongoosePaginate);
DocumentoIngresanteSchema.plugin(uniqueValidator);
DocumentoIngresanteSchema.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('ModalidadIngreso', DocumentoIngresanteSchema).plural('modalidadingreso');
