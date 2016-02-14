var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var cursoAperturadoPeriodoSchema = new Schema({
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
  creditosEfectivos: Number,
  estado:{type: String,
  enum: ['Activo','Cerrado'],
  required: true
  },
	createdAt:Date,
	updatedAt:Date
});

cursoAperturadoPeriodoSchema.pre('save',function(next){
	var now = new Date();
	this.updatedAt = now;
	if (!this.createdAt){
		this.createdAt=now;
	}
	next();
});

module.exports = mongoose.model('CursoAperturadoPeriodo', cursoAperturadoPeriodoSchema).plural('cursoaperturadoperiodos');
