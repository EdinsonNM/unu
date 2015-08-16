var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var EscuelaSchema = new Schema({	nombre : {		type:String,		required:true	},  _facultad:{    type:Schema.Types.ObjectId,    ref:'Facultad',    required:true  },	created_at:Date,	updated_at:Date});
EscuelaSchema.plugin(mongoosePaginate);

EscuelaSchema.pre('save',function(next){
	var now = new Date;
	this.updated_at = now;
	if (!this.created_at){
		this.created_at=now;
	}
	next();
});

module.exports = mongoose.model('Escuela', EscuelaSchema).plural('escuelas');
