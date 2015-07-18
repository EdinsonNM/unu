var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema   = mongoose.Schema;

var AulaSchema = new Schema({
	nombre : {
		type:String,
		required:true
	},
	abreviatura : {
		type:String,
		required:true
	},
  	_pabellon:{
    type:Schema.Types.ObjectId,
    ref:'Pabellon',
    required:true
  },
	created_at:Date,
	updated_at:Date
});

AulaSchema.plugin(mongoosePaginate);
AulaSchema.pre('save',function(next){
	var now = new Date;
	this.updated_at = now;
	if (!this.created_at){
		this.created_at=now;
	}
	next();
});

module.exports = mongoose.model('Aula', AulaSchema).plural('aulas');
