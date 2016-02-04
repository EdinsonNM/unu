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
  documento: {
    type: String
    //,required: true
  },
  telefono: {
    type: String
    //,required: true
  },
  direccion: {
    type: String
    //,required: true
  },
  email: {
    type: String
    //,required: true
  },
  fechaNacimiento: {
    type: Date
    //,required: true
  },
  sexo: {
    type: String,
    enum:['Femenino','Masculino']
    //,required: true
  },
  estadoCivil: {
    type: String,
    enum:['Soltero(a)','Casado(a)','Viudo(a)','Divorciado(a)','Conviviente','Separado(a)']
    //,required: true
  },
  lugarNacimiento: {
    type: String
    //,required: true
  },
  _periodoIngreso:{
    type:Schema.Types.ObjectId,
    ref:'Periodo'
  },
  _escuela:{
    type:Schema.Types.ObjectId,
    ref:'Escuela'
  },
  _modalidadIngreso:{
    type:Schema.Types.ObjectId,
    ref:'ModalidadIngreso'
  },
  _tipoCondicionAlumno:{
    type:Schema.Types.ObjectId,
    ref:'TipoCondicionAlumno'
  },
  _situacionAlumno:{
    type:Schema.Types.ObjectId,
    ref:'SituacionAlumno'
  },
  // NOTE cuando se registra un alumno este se crea con un usuario del sistema, considerar esto en la UI
  _usuario:{
    type:Schema.Types.ObjectId,
    ref:'Usuario',
    required:true
  },
  _avanceCurricular:{
    type:Schema.Types.ObjectId,
    ref:'AvanceCurricular',
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
