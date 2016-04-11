var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var TipoSituacionAlumnoSchema = new Schema({
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
TipoSituacionAlumnoSchema.plugin(mongoosePaginate);
TipoSituacionAlumnoSchema.plugin(uniqueValidator);
TipoSituacionAlumnoSchema.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('TipoSituacionAlumno', TipoSituacionAlumnoSchema);
