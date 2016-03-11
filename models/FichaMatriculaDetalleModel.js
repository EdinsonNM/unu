var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var FichaMatriculaDetalleSchema = new Schema({
  _fichaMatricula:{
    type:Schema.Types.ObjectId,
    ref:'FichaMatricula',
    required:true
  },
  _planEstudiosDetalle:{
    type:Schema.Types.ObjectId,
    ref:'Planestudiodetalle',
    required:true
  },
  numeroVeces:Number,

});
FichaMatriculaDetalleSchema.plugin(mongoosePaginate);
FichaMatriculaDetalleSchema.plugin(uniqueValidator);
FichaMatriculaDetalleSchema.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('FichaMatriculaDetalle', FichaMatriculaDetalleSchema).plural('fichamatriculadetalles');
