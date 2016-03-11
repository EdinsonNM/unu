var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var TipotasaSchema = new Schema({
	nombre : {
		type:String,
		required:true
	},
  activo:{
    type:Boolean,
		required:true,
    default:true
  },
	createdAt:Date,
	updatedAt:Date
});

TipotasaSchema.pre('save',function(next){
	var now = new Date();
	this.updatedAt = now;
	if (!this.createdAt){
		this.createdAt=now;
	}
	next();
});

module.exports = mongoose.model('Tipotasa', TipotasaSchema).plural('tipotasa');
