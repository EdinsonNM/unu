var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
//INFO es el archivo que se generara y enviara al banco
var ArchivoBancoSchema = new Schema({
  nombre:String,
  registros:Number,
  importeTotal:Number,
  tipo: {
    type: String,
    enum:['E','S'],
    required: true
  },
  fechabanco:Date,  //Fecha que genero el banco.
  version:Number,
  createdAt: Date,
  updatedAt: Date
});
ArchivoBancoSchema.plugin(mongoosePaginate);
ArchivoBancoSchema.plugin(uniqueValidator);
ArchivoBancoSchema.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});
module.exports = mongoose.model('ArchivoBanco', ArchivoBancoSchema).plural('archivobancos');
