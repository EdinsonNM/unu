var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var DocenteSchema = new Schema({
  codigo: {
    type: String,
    required: true
  },
  nombres: {
    type: String,
    required: true
  },
  apellidos: {
    type: String,
    required: true
  },
  condicion:{
    type:String,
    enum:['Nombrado','Contratado']
  },
  grado:{
    type:String,
    enum:['Bachiller','Magister','Doctor','PHD']
  },
  tipoDedicacion:{
    type:String,
    enum:['Tiempo Completo','Dedicación Exclusiva','Tiempo Parcial']
  },
  _facultad:{
    type:Schema.Types.ObjectId,
    ref:'Facultad',
    required:true
  },
  // NOTE cuando se registra un docente este se crea con un usuario del sistema, considerar esto en la UI
  _usuario:{
    type:Schema.Types.ObjectId,
    ref:'Usuario',
    required:true
  },
  createdAt: Date,
  updatedAt: Date
});
DocenteSchema.plugin(mongoosePaginate);
DocenteSchema.plugin(uniqueValidator);
DocenteSchema.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('Docente', DocenteSchema).plural('docentes');
