var EscuelaModel = require('./EscuelaModel');
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var FacultadSchema = new Schema({
	codigo: {
		type:String,
		required:true,
		unique: true
	},
	resolucion:String,
	nombre : {
		type:String,
		required:true
	},
	_escuelas:[{
    type:Schema.Types.ObjectId,
    ref:'Escuela',
    required:true
  }],
	procesos:[{
    type:Schema.Types.ObjectId,
    ref:'ProcesoFacultad',
    required:true
  }],
	createdAt:Date,
	updatedAt:Date
});
FacultadSchema.plugin(mongoosePaginate);
FacultadSchema.plugin(uniqueValidator);
FacultadSchema.pre('save',function(next){
	var now = new Date();
	this.updatedAt = now;
	if (!this.createdAt){
		this.createdAt=now;
	}
	next();
});

module.exports = mongoose.model('Facultad', FacultadSchema).plural('facultades');
