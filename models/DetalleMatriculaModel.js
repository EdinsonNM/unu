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
    updatedAt: Date,
    /*
    *Proceso: Se agrego el detalle en el sistema pero aun no se ha generado la pre-matricula
    *Separado: Se registro la prematricula y el compromiso de pago aun se encuentra vigente
    *Registrado: Se ha confirmado la matricula cuando se realizo el pago del compromiso del pago
    *Liberado: no se realizo el pago de la prematricula y vencio la fecha del compromiso de pago
    *SinCupo: En proceso pero sin cupo disponible
    */
    estado:{
      type:'String',
      enum:['Proceso','Separado','Registrado','Liberado','SinCupo'],
      default:'Proceso'
    }
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
