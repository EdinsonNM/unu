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
  createdAt: Date,
  updatedAt: Date
});
CursoSchema.plugin(mongoosePaginate);
CursoSchema.plugin(uniqueValidator);
CursoSchema.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('Curso', CursoSchema).plural('cursos');
