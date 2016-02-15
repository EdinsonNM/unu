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
  created_at:Date,
	updated_at:Date
});

cursoAperturadoPeriodoSchema.pre('save',function(next){
	var now = new Date();
	this.updated_at = now;
	if (!this.created_at){
		this.created_at=now;
	}
	next();
});
module.exports = mongoose.model('CursoAperturadoPeriodo', CursoAperturadoPeriodoSchema).plural('cursoAperturadoPeriodos');
