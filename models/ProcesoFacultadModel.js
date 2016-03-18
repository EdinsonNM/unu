var EscuelaModel = require('./EscuelaModel');
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var ProcesoFacultadSchema = new Schema({
	_facultad:{
			type: Schema.Types.ObjectId,
			ref: 'Facultad',
			required: true
	},
	_proceso: {
			type: Schema.Types.ObjectId,
			ref: 'Proceso',
			required: true
	},
	_periodo: {
			type: Schema.Types.ObjectId,
			ref: 'Periodo',
			required: true
	},
	fechaInicio: Date,
	fechaFin: Date,

	createdAt:Date,
	updatedAt:Date
});
ProcesoFacultadSchema.plugin(mongoosePaginate);
ProcesoFacultadSchema.plugin(uniqueValidator);
ProcesoFacultadSchema.pre('save',function(next){
	var now = new Date();
	this.updatedAt = now;
	if (!this.createdAt){
		this.createdAt=now;
	}
	next();
});

module.exports = mongoose.model('ProcesoFacultad', ProcesoFacultadSchema).plural('procesofacultades');
