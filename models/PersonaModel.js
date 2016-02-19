var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var PersonaSchema = new Schema({
  nombreCompleto: {
    type: String,
    required: true
  },
  nombres: {
    type: String,
    required: true
  },
  apellidoPaterno: {
    type: String,
    required: true
  },
  apellidoMaterno: {
    type: String,
    required: true
  },
  documentoIdentidad: {
      tipo: {
          type: String,
          enum: ['DNI', 'CARNET EXTRANJERIA'],
          default: 'DNI'
      },
      numero: String
  },
  fechaNacimiento: {
    type: Date
    //,required: true
  },
  sexo: {
    type: String,
    enum:['Femenino', 'Masculino']
  },
  lugarNacimiento: {
      type: String
    //nacionalidad:String,
    //ubigeo:String,

  },
  telefono: {
    type: String
    //,required: true
  },
  direccion: {
    type: String
    //,required: true
  },
  email: {
    type: String
    //,required: true
  },
  _alumno:[{
      type:Schema.Types.ObjectId,
      ref:'Alumno',
      required:true
  }],
  _ingresante:[{
    type:Schema.Types.ObjectId,
    ref:'Ingresante',
    required:true
  }],
  createdAt: Date,
  updatedAt: Date
});
PersonaSchema.plugin(mongoosePaginate);
PersonaSchema.plugin(uniqueValidator);
PersonaSchema.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  this.nombreCompleto = this.nombres +' '+this.apellidoPaterno+' '+this.apellidoMaterno;
  next();
});
module.exports = mongoose.model('Persona', PersonaSchema).plural('personas');
