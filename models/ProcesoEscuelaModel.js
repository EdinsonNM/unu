/*
Parametro: Define los tipos de parametros que seran incluidos para cada periodo o escuela
*/
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var ProcesoEscuelaSchema = new Schema({
  _escuela:{
			type:Schema.Types.ObjectId,
    	ref:'Escuela',
    	required:true
		},
  _periodo:{
			type:Schema.Types.ObjectId,
    	ref:'Periodo',
    	required:true
	},
  procesos:[{
    _proceso:{
  			type:Schema.Types.ObjectId,
      	ref:'Parametro',
      	required:true
  	},
    inicio:Date,
    fin:Date,
    estado:{
      type:String,
      enum:['Ejecutado','No Ejecutado'],
      default:'No Ejecutado'
    }
  }],
	created_at:Date,
	updated_at:Date
});
ProcesoEscuelaSchema.plugin(mongoosePaginate);
ProcesoEscuelaSchema.plugin(uniqueValidator);
ProcesoEscuelaSchema.pre('save',function(next){
	var now = new Date();
	this.updated_at = now;
	if (!this.created_at){
		this.created_at=now;
	}
	next();
});

module.exports = mongoose.model('ProcesoEscuela', ProcesoEscuelaSchema).plural('procesossescuelas');
