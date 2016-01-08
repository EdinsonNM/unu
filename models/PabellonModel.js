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
  created_at: Date,
  updated_at: Date
});
PabellonSchema.plugin(mongoosePaginate);
PabellonSchema.plugin(uniqueValidator);
PabellonSchema.pre('save', function(next) {
  var now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

module.exports = mongoose.model('Pabellon', PabellonSchema).plural('pabellones');