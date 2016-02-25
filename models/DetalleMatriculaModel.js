var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var DetalleMatriculaSchema = new Schema({
    _matricula:{
      type:Schema.Types.ObjectId,
      ref:'Matricula',
      required:true
    },
    _grupoCurso:{
      type:Schema.Types.ObjectId,
      ref:'GrupoCurso',
      required:true
    },
    orden:Number,
    createdAt: Date,
    updatedAt: Date
});
DetalleMatriculaSchema.plugin(mongoosePaginate);
DetalleMatriculaSchema.plugin(uniqueValidator);
DetalleMatriculaSchema.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});
module.exports = mongoose.model('DetalleMatricula', DetalleMatriculaSchema).plural('detallematriculas');
