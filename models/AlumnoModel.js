var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var AlumnoSchema = new Schema({
  codigoUniversitario: {
    type: String,
    required: true
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
  estadoCivil: {
    type: String,
    enum:['Soltero(a)','Casado(a)','Viudo(a)','Divorciado(a)','Conviviente','Separado(a)']
    //,required: true
  },
  _persona:{
    type:Schema.Types.ObjectId,
    ref:'Persona'
  },
  _ingresante:{
    type:Schema.Types.ObjectId,
    ref:'Ingresante'
  },
  _periodoIngreso:{
    type:Schema.Types.ObjectId,
    ref:'Periodo'
  },
  _facultad:{
    type:Schema.Types.ObjectId,
    ref:'Facultad'
  },
  _escuela:{
    type:Schema.Types.ObjectId,
    ref:'Escuela'
  },
  _tipoCondicionAlumno:{
    type:Schema.Types.ObjectId,
    ref:'TipoCondicionAlumno'
  },
  _situacionAlumno:{
    type:Schema.Types.ObjectId,
    ref:'SituacionAlumno'
  },
  _usuario:{
    type:Schema.Types.ObjectId,
    ref:'Usuario',
    required:true
  },
  _avanceCurricular:[{
    type:Schema.Types.ObjectId,
    ref:'AvanceCurricular',
    required:true
  }],
  createdAt: Date,
  updatedAt: Date
});
AlumnoSchema.plugin(mongoosePaginate);
AlumnoSchema.plugin(uniqueValidator);
AlumnoSchema.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});
module.exports = mongoose.model('Alumno', AlumnoSchema).plural('alumnos');
