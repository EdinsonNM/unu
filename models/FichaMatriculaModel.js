var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var FichaMatriculaSchema = new Schema({
  _alumno:{
    type:Schema.Types.ObjectId,
    ref:'Alumno',
    required:true
  },
  _periodo:{
    type:Schema.Types.ObjectId,
    ref:'Planestudio',
    required:true
  },
  _escuela:{
    type:Schema.Types.ObjectId,
    ref:'Planestudio',
    required:true
  },
  _condicionAlumno:{
    type:Schema.Types.ObjectId,
    ref:'Planestudio',
    required:true
  },
  estadoFichaMatricula:{
    type:'String',
    enum:['GENERADA','MATRICULADO','RETIRO TOTAL']
  },
  ampliacion:{
    type:Boolean,
    default:false
  },
  promedioPonderadoPeriodoAnterior:Number,
  numeroCursosRepetidos:Number,
  creditos:{
    maximoampliacion:Number,
    totalampliados:Number,
    maximo:{
      creditosmatricula:Number,
      cursosmatricula:Number
    }

  },
  matricula:{
    orden:Number,
    creditos:Number,
    cursos:Number,
    fecha:Date,
  },
  ordenMerito:{
    general:Number,
    periodoanterior:Number
  },
  _detalles:[{
    type:Schema.Types.ObjectId,
    ref:'FichaMatriculaDetalle',
    required:true
  }],
  fechaAmpliacion:Date,
  createdAt: Date,
  updatedAt: Date
});
FichaMatriculaSchema.plugin(mongoosePaginate);
FichaMatriculaSchema.plugin(uniqueValidator);
FichaMatriculaSchema.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('FichaMatricula', FichaMatriculaSchema).plural('fichamatriculas');
