var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');

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
  _grupos:[{
    type: Schema.Types.ObjectId,
    ref: 'GrupoCursos',
    required: true
  }],
  createdAt:Date,
	updatedAt:Date
});

CursoAperturadoPeriodoSchema.plugin(mongoosePaginate);
CursoAperturadoPeriodoSchema.plugin(uniqueValidator);

CursoAperturadoPeriodoSchema.pre('save',function(next){
	var now = new Date();
	this.updatedAt = now;
	if (!this.createdAt){
		this.createdAt=now;
	}
	next();
});

module.exports = mongoose.model('CursoAperturadoPeriodo', CursoAperturadoPeriodoSchema).plural('cursoaperturadoperiodos');
