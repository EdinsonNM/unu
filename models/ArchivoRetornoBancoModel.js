var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
//INFO es el archivo que se generara y enviara al banco
var ArchivoRetornoBancoSchema = new Schema({
  archivo:Number,
  created_at: Date,
  updated_at: Date
});
ArchivoRetornoBancoSchema.plugin(mongoosePaginate);
ArchivoRetornoBancoSchema.plugin(uniqueValidator);
ArchivoRetornoBancoSchema.pre('save', function(next) {
  var now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});
module.exports = mongoose.model('ArchivoRetornoBanco', ArchivoRetornoBancoSchema).plural('archivoretornobancos');
