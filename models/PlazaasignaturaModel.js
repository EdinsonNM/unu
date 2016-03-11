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
	createdAt:Date,
	updatedAt:Date
});

PlazaasignaturaSchema.pre('save',function(next){
	var now = new Date;
	this.updatedAt = now;
	if (!this.createdAt){
		this.createdAt=now;
	}
	next();
});

module.exports = mongoose.model('Plazaasignatura', PlazaasignaturaSchema).plural('plazaasignaturas');
