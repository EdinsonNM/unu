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
	created_at:Date,
	updated_at:Date
});

MicAsignaturaSchema.plugin(mongoosePaginate);
MicAsignaturaSchema.pre('save',function(next){
	var now = new Date();
	this.updated_at = now;
	if (!this.created_at){
		this.created_at=now;
	}
	next();
});

module.exports = mongoose.model('MicAsignatura', MicAsignaturaSchema).plural('mic_asignaturas');
