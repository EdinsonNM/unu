var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var AlumnoSchema = new Schema({
    codigo: {
        type: String,
        required: true
    },
    estadoCivil: {
        type: String,
        enum: ['Soltero(a)', 'Casado(a)', 'Viudo(a)', 'Divorciado(a)', 'Conviviente', 'Separado(a)']
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
    educacionGratuita:{
      type:Boolean,
      default:true
    },
    _persona: {
        type: Schema.Types.ObjectId,
        ref: 'Persona'
    },
    _ingresante: {
        type: Schema.Types.ObjectId,
        ref: 'Ingresante'
    },
    _periodoInicio: {
        type: Schema.Types.ObjectId,
        ref: 'Periodo'
    },
    _facultad: {
        type: Schema.Types.ObjectId,
        ref: 'Facultad'
    },
    _escuela: {
        type: Schema.Types.ObjectId,
        ref: 'Escuela'
    },
    _usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    // [NORMAL, [cualquier otro estado que indique que el alumno esta fuera de la universidad]]
    _tipoCondicionAlumno: {
        type: Schema.Types.ObjectId,
        ref: 'TipoCondicionAlumno'
    },
    //NOTE [INGRESANTE,REGULAR,DESAPROBADO,SIN RETIRO,CREDITOS MENOR PERMITIDO,AMONESTADO,RESAGADO,CON SUSPENSION,OBSERVADO,PRIMER PUESTO]
    _situacionAlumno: {
        type: Schema.Types.ObjectId,
        ref: 'SituacionAlumno'
    },
    //NOTE es la modalidad de ingreso a la universidad
    _modalidadIngreso: {
        type: Schema.Types.ObjectId,
        ref: 'Periodo'
    },
    historial:{
      condicionesAlumno:[{
        createdAt:Date,
        _periodo:{
          type: Schema.Types.ObjectId,
          ref: 'Periodo'
        },
        _condicion:{
            type: Schema.Types.ObjectId,
            ref: 'TipoCondicionAlumno'
        }
      }],
      situacionesAlumno:[{
        createdAt:Date,
        _periodo:{
          type: Schema.Types.ObjectId,
          ref: 'Periodo'
        },
        _condicion:{
            type: Schema.Types.ObjectId,
            ref: 'SituacionAlumno'
        }
      }]
    },
    _avanceCurricular: [{
        type: Schema.Types.ObjectId,
        ref: 'AvanceCurricular',
        default:null
    }],
    createdAt: Date,
    updatedAt: Date

});
AlumnoSchema.plugin(mongoosePaginate);
AlumnoSchema.plugin(uniqueValidator);
AlumnoSchema.pre('save', function(next) {
    var now = new Date();
    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});
module.exports = mongoose.model('Alumno', AlumnoSchema).plural('alumnos');
