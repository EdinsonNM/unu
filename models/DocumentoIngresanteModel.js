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
  created_at: Date,
  updated_at: Date
});
DocumentoIngresanteSchema.plugin(mongoosePaginate);
DocumentoIngresanteSchema.plugin(uniqueValidator);
DocumentoIngresanteSchema.pre('save', function(next) {
  var now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

module.exports = mongoose.model('ModalidadIngreso', DocumentoIngresanteSchema).plural('modalidadingreso');
