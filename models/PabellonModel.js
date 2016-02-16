var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var PabellonSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  abreviatura: {
    type: String,
    required: true
  },
  createdAt: Date,
  updatedAt: Date
});
PabellonSchema.plugin(mongoosePaginate);
PabellonSchema.plugin(uniqueValidator);
PabellonSchema.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('Pabellon', PabellonSchema).plural('pabellones');
