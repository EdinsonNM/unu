var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var PrerequisitoSchema = new Schema({
	nombre : {
		type:String,
		required:true
	},
  _requisito:{
    type:Schema.Types.ObjectId,
    ref:'Requisito',
    required:true
  },
  _planestudiodetalle:{
    type:Schema.Types.ObjectId,
    ref:'Planestudiodetalle',
    required:true
  },
	created_at:Date,
	updated_at:Date
});

PrerequisitoSchema.pre('save',function(next){
	var now = new Date;
	this.updated_at = now;
	if (!this.created_at){
		this.created_at=now;
	}
	next();
});

module.exports = mongoose.model('Prerequisito', PrerequisitoSchema).plural('prerequisitos');
