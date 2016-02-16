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
	createdAt:Date,
	updatedAt:Date
});
GradoDocenteSchema.plugin(mongoosePaginate);
GradoDocenteSchema.plugin(uniqueValidator);
GradoDocenteSchema.pre('save',function(next){
	var now = new Date();
	this.updatedAt = now;
	if (!this.createdAt){
		this.createdAt=now;
	}
	next();
});

module.exports = mongoose.model('GradoDocente', GradoDocenteSchema).plural('gradodocentes');
