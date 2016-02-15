var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var HorarioSchema = new Schema({
  _programacionGrupoCurso:{
    type:Schema.Types.ObjectId,
    ref:'ProgramacionGrupoCurso',
    required:true
  },
  dia:{type: String,
  enum: ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'],
  required: true
  },
  //horaInicio:date,definir tipo de dato
  duracion:{tipe:Number,enum:['1','2']},
  created_at:Date,
	updated_at:Date
});

HorarioSchema.pre('save',function(next){
	var now = new Date;
	this.updated_at = now;
	if (!this.created_at){
		this.created_at=now;
	}
	next();
});

module.exports = mongoose.model('Horario', HorarioSchema).plural('horarios');
