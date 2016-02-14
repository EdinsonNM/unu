var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var IngresanteSchema = new Schema({
    codigoPostulante: {
        type: String,
        required: true
    },
    promedio: Number,
    documentoIdentidad: {
        tipo: {
            type: String,
            enum: ['DNI', 'CARNET EXTRANJERIA'],
            default: 'DNI'
        },
        numero: String
    },
    sexo: {
        type: String,
        enum: ['Masculino', 'Femenino']
    },
    estado:{
        type: String,
        enum:['Registrado','Aprobado'],
        default: 'Registrado'
    },
    _facultad: {
        type: Schema.Types.ObjectId,
        ref: 'Facultad',
        required: true
    },
    _escuela: {
        type: Schema.Types.ObjectId,
        ref: 'Escuela',
        required: true
    },
    _modalidad: {
        type: Schema.Types.ObjectId,
        ref: 'ModalidadIngreso',
        required: true
    },
    _periodo: {
        type: Schema.Types.ObjectId,
        ref: 'Periodo',
        required: true
    },
    _persona:{
      type: Schema.Types.ObjectId,
      ref: 'Persona',
      required: true
    },
    createdAt: Date,
    updatedAt: Date
});
IngresanteSchema.plugin(mongoosePaginate);
IngresanteSchema.pre('save', function(next) {
    var now = new Date();
    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('Ingresante', IngresanteSchema).plural('ingresantes');
