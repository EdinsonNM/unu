var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var TipoAlumnoSchema = new Schema({
  codigo: {
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  abreviatura: {
    type: String,
    required: true
  },
  createdAt: Date,
  updatedAt: Date
});
TipoAlumnoSchema.plugin(mongoosePaginate);
TipoAlumnoSchema.plugin(uniqueValidator);
TipoAlumnoSchema.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('TipoAlumno', TipoAlumnoSchema).plural('tipoalumnos');
