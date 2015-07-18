var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var PlazaasignaturaSchema = new Schema({	

  _plaza:{
    type:Schema.Types.ObjectId,
    ref:'Plaza',
    required:true
  },
  _planestudiodetallegrupo:{
    type:Schema.Types.ObjectId,
    ref:'Planestudiodetallegrupo',
    required:true
  },
	created_at:Date,
	updated_at:Date
});

PlazaasignaturaSchema.pre('save',function(next){
	var now = new Date;
	this.updated_at = now;
	if (!this.created_at){
		this.created_at=now;
	}
	next();
});

module.exports = mongoose.model('Plazaasignatura', PlazaasignaturaSchema).plural('plazaasignaturas');
