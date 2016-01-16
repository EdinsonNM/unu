var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var PlanestudioSchema = new Schema({
	nombre : {
		type:String,
		required:true
	},
	resolucion : {
		type:String
	},
	total_creditos : {
		type:Number,
		required:true,
		default:0
	},
	total_horas : {
		type:Number,
		required:true,
		default:0
	},
	total_horas_teoria : {
		type:Number,
		required:true,
		default:0
	},
	total_horas_practica : {
		type:Number,
		required:true,
		default:0
	},
	total_horas_laboratorio : {
		type:Number,
		required:true,
		default:0
	},
	fecha_resolucion : {
		type:Date
	},
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
	estado:{
		type: String,
		enum:['Registrado','Pendiente','Observado','Aprobado','No Activo'],
		default: 'Registrado'
	},
	historial:[
		{
			estado:{
				type: String,
				enum:['Registrado','Enviado','Observado','Aprobado','No Activo']
			},
			created_at:Date
		}
	],
	created_at:Date,
	updated_at:Date
});
PlanestudioSchema.plugin(mongoosePaginate);
PlanestudioSchema.pre('save',function(next){
	var now = new Date();
	this.updated_at = now;
	if (!this.created_at){
		this.created_at=now;
	}
	next();
});

module.exports = mongoose.model('Planestudio', PlanestudioSchema).plural('planestudios');
