var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var DistribucionauladetalleSchema = new Schema({
	fechaInicio : {
		type: Date,
		required:true
	},
	fechaFin : {
		type: Date,
		required:true
	},

  _aula:{
    type:Schema.Types.ObjectId,
    ref:'Aula',
    required:true
  },
  _escuela:{
    type:Schema.Types.ObjectId,
    ref:'Escuela',
    required:true
  },
  _distribucionaula:{
    type:Schema.Types.ObjectId,
    ref:'Distribucionaula',
    required:true
  },
	created_at:Date,
	updated_at:Date
});

DistribucionauladetalleSchema.pre('save',function(next){
	var now = new Date;
	this.updated_at = now;
	if (!this.created_at){
		this.created_at=now;
	}
	next();
});

module.exports = mongoose.model('Distribucionauladetalle', DistribucionauladetalleSchema).plural('distribucionauladetalles');
