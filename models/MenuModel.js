var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var MenuSchema = new Schema({
	titulo : {
		type:String,
		required:true
	},
  _padre:{
    type:Schema.Types.ObjectId,
    ref:'Menu',
    required:true
  },
  icono:{
		type:String
	},
  url:{
		type:String
	},
  orden:{
		type:Number
	},
	created_at:Date,
	updated_at:Date
});


MenuSchema.pre('save',function(next){
	var now = new Date;
	this.updated_at = now;
	if (!this.created_at){
		this.created_at=now;
	}
	next();
});

module.exports = mongoose.model('Menu', MenuSchema).plural('facultades');
