var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var PlanestudiodetallegrupoSchema = new Schema({	

  _periodo:{
    type:Schema.Types.ObjectId,
    ref:'Periodo',
    required:true
  },
  _planestudiodetalle:{
    type:Schema.Types.ObjectId,
    ref:'Planestudiodetalle',
    required:true
  },
  _distribucionauladetalle:{
    type:Schema.Types.ObjectId,
    ref:'Distribucionauladetalle',
    required:true
  },
	created_at:Date,
	updated_at:Date
});

PlanestudiodetallegrupoSchema.pre('save',function(next){
	var now = new Date;
	this.updated_at = now;
	if (!this.created_at){
		this.created_at=now;
	}
	next();
});

module.exports = mongoose.model('Planestudiodetallegrupo', PlanestudiodetallegrupoSchema).plural('planestudiodetallegrupos');
