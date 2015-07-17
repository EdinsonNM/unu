var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var TipocursoSchema = new Schema({
	
	nombre : {
		type:String,
		required:true
	},
	created_at:Date,
	updated_at:Date
});

TipocursoSchema.pre('save',function(next){
	var now = new Date;
	this.updated_at = now;
	if (!this.created_at){
		this.created_at=now;
	}
	next();
});

module.exports = mongoose.model('Tipocurso', TipocursoSchema).plural('tipocursos');
