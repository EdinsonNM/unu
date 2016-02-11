var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var OtrasdeudasalumnoSchema = new Schema({
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
  created_at: Date,
  updated_at: Date
});
OtrasdeudasalumnoSchema.plugin(mongoosePaginate);
OtrasdeudasalumnoSchema.plugin(uniqueValidator);
OtrasdeudasalumnoSchema.pre('save', function(next) {
  var now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});
module.exports = mongoose.model('Otrasdeudasalumno', OtrasdeudasalumnoSchema).plural('otrasdeudasalumnos');
