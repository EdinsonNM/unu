var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var TipocursoSchema = new Schema({
	
	nombre : {
		type:String,
		required:true
	},
	createdAt:Date,
	updatedAt:Date
});

TipocursoSchema.pre('save',function(next){
	var now = new Date;
	this.updatedAt = now;
	if (!this.createdAt){
		this.createdAt=now;
	}
	next();
});

module.exports = mongoose.model('Tipocurso', TipocursoSchema).plural('tipocursos');
