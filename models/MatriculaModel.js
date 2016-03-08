var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var MatriculaSchema = new Schema({
    _periodo:{
      type:Schema.Types.ObjectId,
      ref:'Periodo',
      required:true
    },
    _alumno:{
      type:Schema.Types.ObjectId,
      ref:'Alumno',
      required:true
    },
    _planEstudio:{
      type:Schema.Types.ObjectId,
      ref:'Planestudio',
      required:true
    },
    _escuela:{
      type:Schema.Types.ObjectId,
      ref:'Escuela',
      required:true
    },
    _detalleMatricula:[{
      type:Schema.Types.ObjectId,
      ref:'DetalleMatricula',
      required:true
    }],
    totalCursos:Number,
    totalCreditos:Number,
    /*estado: {
      type: String,
      enum:["Proceso",'Prematriculado','Matriculado'],
      default: "Proceso"
    },*/
    estado:{
      type:Boolean,
      default:false
    },
    createdAt: Date,
    updatedAt: Date
});
MatriculaSchema.plugin(mongoosePaginate);
MatriculaSchema.plugin(uniqueValidator);
MatriculaSchema.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});
module.exports = mongoose.model('Matricula', MatriculaSchema).plural('matriculas');
