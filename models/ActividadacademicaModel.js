var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ActividadacademicaSchema = new Schema({
	resolucion : {
		type:String,
		required:true
	},
  _periodo:{
    type:Schema.Types.ObjectId,
    ref:'Periodo',
    required:true
  },
	createdAt:Date,
	updatedAt:Date
});

ActividadacademicaSchema.pre('save',function(next){
	var now = new Date;
	this.updatedAt = now;
	if (!this.createdAt){
		this.createdAt=now;
	}
	next();
});

module.exports = mongoose.model('Actividadacademica', ActividadacademicaSchema).plural('actividadesacademicas');
