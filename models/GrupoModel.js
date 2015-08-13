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
	created_at:Date,
	updated_at:Date
});


GrupoSchema.pre('save',function(next){
	var now = new Date;
	this.updated_at = now;
	if (!this.created_at){
		this.created_at=now;
	}
	next();
});

module.exports = mongoose.model('Grupo', GrupoSchema).plural('facultades');
