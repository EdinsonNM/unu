var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var SituacionAlumnoSchema = new Schema({
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
SituacionAlumnoSchema.plugin(mongoosePaginate);
SituacionAlumnoSchema.plugin(uniqueValidator);
SituacionAlumnoSchema.pre('save', function(next) {
  var now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

module.exports = mongoose.model('SituacionAlumno', SituacionAlumnoSchema).plural('situacionalumnos');
