var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var programacionGrupoCursoSchema = new Schema({
  _grupoCurso:{
    type:Schema.Types.ObjectId,
    ref:'grupoCurso',
    required:true
  },
  _Aula:{
    type:Schema.Types.ObjectId,
    ref:'Aula',
    required:true
  },
  _Docente:{
    type:Schema.Types.ObjectId,
    ref:'Docente',
    required:true
  },
  modalidadClaseGrupo:{type: String,
  enum: ['Teoria','Practica','Seminario','Laboratorio','Otros'],
  required: true
  },
	created_at:Date,
	updated_at:Date
});

programacionGrupoCursoSchema.pre('save',function(next){
	var now = new Date;
	this.updated_at = now;
	if (!this.created_at){
		this.created_at=now;
	}
	next();
});

module.exports = mongoose.model('programacionGrupoCurso', programacionGrupoCursoSchema).plural('programacionGrupoCursos');
