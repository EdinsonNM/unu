var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var TipoCondicionAlumnoSchema = new Schema({
  codigo: {
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  createdAt: Date,
  updatedAt: Date
});
TipoCondicionAlumnoSchema.plugin(mongoosePaginate);
TipoCondicionAlumnoSchema.plugin(uniqueValidator);
TipoCondicionAlumnoSchema.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('TipoCondicionAlumno', TipoCondicionAlumnoSchema).plural('tipocondicionalumnos');
