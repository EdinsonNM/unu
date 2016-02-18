var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var CursoAperturadoPeriodoSchema = new Schema({
  _periodo:{
    type:Schema.Types.ObjectId,
    ref:'Periodo',
    required:true
  },
  _planestudiodetalle:{
    type:Schema.Types.ObjectId,
    ref:'Planestudiodetalle',
    required:true
  },
  aperturados:[{
    type: Schema.Types.ObjectId,
    ref: 'GrupoCursos',
    required: true
  }],
  createdAt:Date,
	updatedAt:Date
});

CursoAperturadoPeriodoSchema.pre('save',function(next){
	var now = new Date();
	this.updatedAt = now;
	if (!this.createdAt){
		this.createdAt=now;
	}
	next();
});

module.exports = mongoose.model('CursoAperturadoPeriodo', CursoAperturadoPeriodoSchema).plural('cursoaperturadoperiodos');
