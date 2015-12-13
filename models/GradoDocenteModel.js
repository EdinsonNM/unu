var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
//BACHILLER,MAGISTER,DOCTOR,PHD
var GradoDocenteSchema = new Schema({
	nombre : {
		type:String,
		required:true
	},
	created_at:Date,
	updated_at:Date
});
GradoDocenteSchema.plugin(mongoosePaginate);
GradoDocenteSchema.plugin(uniqueValidator);
GradoDocenteSchema.pre('save',function(next){
	var now = new Date();
	this.updated_at = now;
	if (!this.created_at){
		this.created_at=now;
	}
	next();
});

module.exports = mongoose.model('GradoDocente', GradoDocenteSchema).plural('gradodocentes');
