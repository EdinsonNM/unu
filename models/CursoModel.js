var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var CursoSchema = new Schema({
  codigo: {
    type: String,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: ['General','Carrera'],
    required: true
  },
  created_at: Date,
  updated_at: Date
});
CursoSchema.plugin(mongoosePaginate);
CursoSchema.plugin(uniqueValidator);
CursoSchema.pre('save', function(next) {
  var now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

module.exports = mongoose.model('Curso', CursoSchema).plural('cursos');
