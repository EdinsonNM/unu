var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var IngresanteSchema = new Schema({
	//es la modalidad de ingreso
	_modalidad:{
		type:Schema.Types.ObjectId,
    ref:'ModalidadIngreso',
    required:true
	},
	constanciaIngreso:{
		existe: Boolean,
		created_at: Date,
		numero:String //nro documento de la constancia de ingreso
	},
	tipoIngresante:{
		type:String,
		enum:['Ordinario','Estudiante 4to y 5to']
	},
	_documentosPresentados:[{
		type:Schema.Types.ObjectId,
    ref:'DocumentoIngresante'
	}],
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
