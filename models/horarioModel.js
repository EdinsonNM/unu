var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var HorarioSchema = new Schema({
  _programacionGrupoCurso:{
    type:Schema.Types.ObjectId,
    ref:'ProgramacionGrupoCurso',
    required:true
  },
  dia:{
    type: String,
    enum: ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'],
    required: true
  },

  createdAt:Date,
	updatedAt:Date
});


HorarioSchema.pre('save',function(next){
	var now = new Date();
	this.updatedAt = now;
	if (!this.createdAt){
		this.createdAt=now;
	}
	next();
});

module.exports = mongoose.model('Horario', HorarioSchema).plural('horarios');
