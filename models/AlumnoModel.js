var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var AlumnoSchema = new Schema({
  codigo: {
    type: String,
    required: true
  },
  nombres: {
    type: String,
    required: true
  },
  apellidos: {
    type: String,
    required: true
  },
  // NOTE cuando se registra un alumno este se crea con un usuario del sistema, considerar esto en la UI
  _usuario:{
    type:Schema.Types.ObjectId,
    ref:'Usuario',
    required:true
  },
  created_at: Date,
  updated_at: Date
});
AlumnoSchema.plugin(mongoosePaginate);
AlumnoSchema.plugin(uniqueValidator);
AlumnoSchema.pre('save', function(next) {
  var now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

module.exports = mongoose.model('Alumno', AlumnoSchema).plural('alumnos');
