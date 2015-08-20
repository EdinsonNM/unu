var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var PlanestudioSchema = new Schema({
	nombre : {
		type:String,
		required:true
	},
	resolucion : {
		type:String,
		required:true
	},
	total_creditos : {
		type:Number,
		required:true
	},
	total_horas : {
		type:Number,
		required:true
	},
	total_horas_teoria : {
		type:Number,
		required:true
	},
	total_horas_practica : {
		type:Number,
		required:true
	},
	total_horas_laboratorio : {
		type:Number,
		required:true
	},
	fecharesolucion : {
		type:Date,
		required:true
	},

  _escuela:{
    type:Schema.Types.ObjectId,
    ref:'Escuela',
    required:true
  },
  _periodo:{
    type:Schema.Types.ObjectId,
    ref:'Periodo',
    required:true
  },
	created_at:Date,
	updated_at:Date
});
PlanestudioSchema.plugin(mongoosePaginate);
PlanestudioSchema.pre('save',function(next){
	var now = new Date;
	this.updated_at = now;
	if (!this.created_at){
		this.created_at=now;
	}
	next();
});

module.exports = mongoose.model('Planestudio', PlanestudioSchema).plural('planestudios');
