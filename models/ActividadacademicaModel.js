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
	created_at:Date,
	updated_at:Date
});

ActividadacademicaSchema.pre('save',function(next){
	var now = new Date;
	this.updated_at = now;
	if (!this.created_at){
		this.created_at=now;
	}
	next();
});

module.exports = mongoose.model('Actividadacademica', ActividadacademicaSchema).plural('actividadesacademicas');
