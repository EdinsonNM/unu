var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var IngresanteSchema = new Schema({
	codigo: {
		type:String,
		required:true
	},
	nombres : {
		type:String,
		required:true
	},
  apellidos : {
		type:String,
		required:true
	},
  _Escuela:{
    type:Schema.Types.ObjectId,
    ref:'Escuela',
    required:true
  },
  sexo:{
    type:String,
    enum:['Masculino','Femenino']
  },
	created_at:Date,
	updated_at:Date
});
IngresanteSchema.plugin(mongoosePaginate);

IngresanteSchema.pre('save',function(next){
	var now = new Date;
	this.updated_at = now;
	if (!this.created_at){
		this.created_at=now;
	}
	next();
});

module.exports = mongoose.model('Escuela', IngresanteSchema).plural('escuelas');
