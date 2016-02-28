var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var ConflictoSchema = new Schema({
  codigo: {
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  activo: {
    type: Boolean,
    default: true
  },
  createdAt: Date,
  updatedAt: Date
});
ConflictoSchema.plugin(mongoosePaginate);
ConflictoSchema.plugin(uniqueValidator);
ConflictoSchema.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});
module.exports = mongoose.model('Conflicto', ConflictoSchema).plural('conflictos');
