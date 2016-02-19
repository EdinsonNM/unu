var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var GrupoSchema = new Schema({
	nombre : {
		type:String,
		required:true
	},
  codigo:{
		type:String,
		required:true,
    uppercase:true
	},
	menu:[],
	createdAt:Date,
	updatedAt:Date
});


GrupoSchema.pre('save',function(next){
	var now = new Date();
	this.updatedAt = now;
	if (!this.createdAt){
		this.createdAt=now;
	}
	next();
});

module.exports = mongoose.model('Grupo', GrupoSchema).plural('grupos');
