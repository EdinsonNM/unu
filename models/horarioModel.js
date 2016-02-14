var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var horarioSchema = new Schema({
  _programacionGrupoCurso:{
    type:Schema.Types.ObjectId,
    ref:'programacionGrupoCurso',
    required:true
  },
  dia:{
    type: String,
    enum: ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'],
    required: true
  },
  horaInicio:Date,
  duracion:{
    type:Number,
    enum:['1','2']
  },
  createdAt:Date,
	updatedAt:Date
});

horarioSchema.pre('save',function(next){
	var now = new Date();
	this.updatedAt = now;
	if (!this.createdAt){
		this.createdAt=now;
	}
	next();
});

module.exports = mongoose.model('horario', horarioSchema).plural('horarios');
