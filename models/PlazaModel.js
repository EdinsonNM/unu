var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var PlazaSchema = new Schema({
	fechaInicio : {
		type: Date,
		required:true
	},
	fechaFin : {
		type: Date,
		required:true
	},

  _tipoplaza:{
    type:Schema.Types.ObjectId,
    ref:'Tipoplaza',
    required:true
  },
  _facultad:{
    type:Schema.Types.ObjectId,
    ref:'Facultad',
    required:true
  },
  _docente:{
    type:Schema.Types.ObjectId,
    ref:'Docente',
    required:true
  },
	created_at:Date,
	updated_at:Date
});

PlazaSchema.pre('save',function(next){
	var now = new Date;
	this.updated_at = now;
	if (!this.created_at){
		this.created_at=now;
	}
	next();
});

module.exports = mongoose.model('Escuela', PlazaSchema).plural('escuelas');
