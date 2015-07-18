var mongoose = require('mongoose');var Schema   = mongoose.Schema;var PeriodoSchema = new Schema({	nombre : {		type:String,		required:true	},  anio : {		type:Number,		required:true	},  periodo : {		type:Number,		required:true	},  resolucion : {		type:String,		required:true	},  fechaResolucion : {		type:Date,		required:true	},  inicio : {		type:Date,		required:true	},  fin : {		type:Date,		required:true	},  	created_at:Date,	updated_at:Date});PeriodoSchema.pre('save',function(next){	var now = new Date;	this.updated_at = now;	if (!this.created_at){		this.created_at=now;	}	next();});module.exports = mongoose.model('Periodo', PeriodoSchema).plural('periodos');