var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var ConflictosalumnoSchema = new Schema({
  _alumno:{
    type:Schema.Types.ObjectId,
    ref:'Alumno',
    required:true
  },
  _conflicto:{
    type:Schema.Types.ObjectId,
    ref:'Conflicto',
    required:true
  },
  estado: {
    type:String,
    enum:['Pendiente','Cancelado']
  },
  createdAt: Date,
  updatedAt: Date
});
ConflictosalumnoSchema.plugin(mongoosePaginate);
ConflictosalumnoSchema.plugin(uniqueValidator);
ConflictosalumnoSchema.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});
module.exports = mongoose.model('ConflictosAlumno', ConflictosalumnoSchema).plural('conflictosalumnos');
