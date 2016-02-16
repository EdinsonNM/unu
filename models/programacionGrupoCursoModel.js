var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ProgramacionGrupoCursoSchema = new Schema({
  _grupoCurso:{
    type:Schema.Types.ObjectId,
    ref:'GrupoCurso',
    required:true
  },
  _aula:{
    type:Schema.Types.ObjectId,
    ref:'Aula',
    required:true
  },
  _docente:{
    type:Schema.Types.ObjectId,
    ref:'Docente',
    required:true
  },
  modalidadClaseGrupo:{
    type: String,
    enum: ['Teoria','Practica','Seminario','Laboratorio','Otros'],
    required: true
  },
  horarios:[{
    dia:{
      type: String,
      enum: ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo']
    },
    horaInicio:Date,
    horaFin:Date
  }],
	createdAt:Date,
	updatedAt:Date
});

ProgramacionGrupoCursoSchema.pre('save',function(next){
	var now = new Date();
	this.updatedAt = now;
	if (!this.createdAt){
		this.createdAt=now;
	}
	next();
});

module.exports = mongoose.model('ProgramacionGrupoCurso', ProgramacionGrupoCursoSchema).plural('programaciongrupocursos');
