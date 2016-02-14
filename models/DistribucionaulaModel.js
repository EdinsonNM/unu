var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var DistribucionaulaSchema = new Schema({
	nombre: {
		type:String,
		required:true
	},
	estado : {
		type:Number,
		required:true
	},
  _pabellon:{
    type:Schema.Types.ObjectId,
    ref:'Pabellon',
    required:true
  },
	_periodos:[{
    type:Schema.Types.ObjectId,
    ref:'Periodo'
  }],
	createdAt:Date,
	updatedAt:Date
});

DistribucionaulaSchema.pre('save',function(next){
	var now = new Date;
	this.updatedAt = now;
	if (!this.createdAt){
		this.createdAt=now;
	}
	next();
});

module.exports = mongoose.model('Distribucionaula', DistribucionaulaSchema).plural('distribucionaulas');
