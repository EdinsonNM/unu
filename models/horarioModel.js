var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var horarioSchema = new Schema({
  _programacionGrupoCurso:{
    type:Schema.Types.ObjectId,
    ref:'programacionGrupoCurso',
    required:true
  },
  dia:{type: String,
  enum: ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'],
  required: true
  },
  horaInicio:date,
  duracion:{tipe:Number,enum:['1','2']}
  created_at:Date,
	updated_at:Date
});

horarioSchema.pre('save',function(next){
	var now = new Date;
	this.updated_at = now;
	if (!this.created_at){
		this.created_at=now;
	}
	next();
});

module.exports = mongoose.model('horario', horarioSchema).plural('horarios');
