var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');

var SeccionSchema = new Schema({
	codigo: {
		type:String,
		required:true
	},
	nombre : {
		type:String,
		required:true
	},
	_facultad: {
			type: Schema.Types.ObjectId,
			ref: 'Facultad',
			required: true
	},
  _escuela:{
    type: Schema.Types.ObjectId,
    ref: 'Escuela',
    required: true
  },
	activo: {
    type: Boolean,
    default: true
  },
	createdAt:Date,
	updatedAt:Date
});
SeccionSchema.plugin(mongoosePaginate);
SeccionSchema.plugin(uniqueValidator);
SeccionSchema.pre('save',function(next){
	var now = new Date();
	this.updatedAt = now;
	if (!this.createdAt){
		this.createdAt=now;
	}
	next();
});

module.exports = mongoose.model('Seccion', SeccionSchema).plural('secciones');
