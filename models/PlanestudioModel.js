var mongoose = require('mongoose');
var Schema = mongoose.Schema;
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
				enum:['Registrado','Pendiente','Observado','Aprobado','No Activo']
			},
			createdAt:Date
		}
	],
	createdAt:Date,
	updatedAt:Date

});
PlanestudioSchema.plugin(mongoosePaginate);
PlanestudioSchema.pre('save', function(next) {
    var now = new Date();
    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('Planestudio', PlanestudioSchema).plural('planestudios');
