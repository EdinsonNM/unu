var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var FacultadSchema = new Schema({	nombre : {		type:String,		required:true	},	_escuelas:[{		type:Schema.ObjectId,		ref:'Escuela'	}],	created_at:Date,	updated_at:Date});

FacultadSchema.pre('save',function(next){
	var now = new Date;
	this.updated_at = now;
	if (!this.created_at){
		this.created_at=now;
	}
	next();
});

module.exports = mongoose.model('Facultad', FacultadSchema);
