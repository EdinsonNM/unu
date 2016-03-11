var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var MicAsignaturaSchema = new Schema({

  _curso:{
    type:Schema.Types.ObjectId,
    ref:'Curso',
    required:true
  },
  sumilla:{
		type:String,
		required:true
	},
	createdAt:Date,
	updatedAt:Date
});

MicAsignaturaSchema.plugin(mongoosePaginate);
MicAsignaturaSchema.pre('save',function(next){
	var now = new Date();
	this.updatedAt = now;
	if (!this.createdAt){
		this.createdAt=now;
	}
	next();
});

module.exports = mongoose.model('MicAsignatura', MicAsignaturaSchema).plural('mic_asignaturas');
