var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var AulaSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  abreviatura: {
    type: String,
    required: true
  },
  _pabellon: {
    type: Schema.Types.ObjectId,
    ref: 'Pabellon',
    required: true
  },
  createdAt: Date,
  updatedAt: Date
});
AulaSchema.plugin(mongoosePaginate);
AulaSchema.plugin(uniqueValidator);
AulaSchema.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('Aula', AulaSchema).plural('aulas');
