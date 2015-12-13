var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var DocenteSchema = new Schema({
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
  condicion:{
    type:String,
    enum:['Nombrado','Contratado']
  },
  _grado:{
    type:Schema.Types.ObjectId,
    ref:'GradoDocente',
    required:true
  },
  tipoDedicacion:{
    type:String,
    enum:['Tiempo Completo','Dedicación Exclusiva','Tiempo Parcial']
  },
  _facultad:{
    type:Schema.Types.ObjectId,
    ref:'Facultad',
    required:true
  },
  // NOTE cuando se registra un docente este se crea con un usuario del sistema, considerar esto en la UI
  _usuario:{
    type:Schema.Types.ObjectId,
    ref:'Usuario',
    required:true
  },
  created_at: Date,
  updated_at: Date
});
DocenteSchema.plugin(mongoosePaginate);
DocenteSchema.plugin(uniqueValidator);
DocenteSchema.pre('save', function(next) {
  var now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

module.exports = mongoose.model('Docente', DocenteSchema).plural('docentes');
