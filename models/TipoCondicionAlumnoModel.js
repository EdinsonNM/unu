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
  created_at: Date,
  updated_at: Date
});
TipoCondicionAlumnoSchema.plugin(mongoosePaginate);
TipoCondicionAlumnoSchema.plugin(uniqueValidator);
TipoCondicionAlumnoSchema.pre('save', function(next) {
  var now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

module.exports = mongoose.model('TipoCondicionAlumno', TipoCondicionAlumnoSchema).plural('tipocondicionalumnos');
