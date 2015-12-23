var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var PlanestudiodetalleSchema = new Schema({
	creditos : {
		type:Number,
		required:true
	},
	horas_teoria : {
		type:Number,
		required:true
	},
	horas_practica : {
		type:Number,
		required:true
	},
	horas_laboratorio : {
		type:Number,
		required:true
	},
	horas_total : {
		type:Number,
		required:true
	},
	ciclo : {
		type:Number,
		required:true
	},
  _curso:{
    type:Schema.Types.ObjectId,
    ref:'Curso',
    required:true
  },
  _planestudio:{
    type:Schema.Types.ObjectId,
    ref:'Planestudio',
    required:true
  },
	_requisitos:[{
		type:Schema.Types.ObjectId,
    ref:'Planestudiodetalle',
	}],
	_revisiones:[{
		created_at:{type:Date},
		comentario:String
	}],
	created_at:Date,
	updated_at:Date
});

PlanestudiodetalleSchema.plugin(mongoosePaginate);

PlanestudiodetalleSchema.pre('save',function(next){
	var now = new Date();
	this.updated_at = now;
	if (!this.created_at){
		this.created_at=now;
	}
	next();
});

module.exports = mongoose.model('Planestudiodetalle', PlanestudiodetalleSchema).plural('planestudiodetalles');
