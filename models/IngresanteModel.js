var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var IngresanteSchema = new Schema({

    codigoPostulante: {
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
    _modalidad: {
        type: Schema.Types.ObjectId,
        ref: 'ModalidadIngreso',
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
    _escuela: {
        type: Schema.Types.ObjectId,
        ref: 'Escuela',
        required: true
    },
    _pagoIngresante: {
        activo: {
            type: Boolean,
            default: false
        },
        voucher: String
    },

    created_at: Date,
    updated_at: Date
});
IngresanteSchema.plugin(mongoosePaginate);

IngresanteSchema.pre('save', function(next) {
    var now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

module.exports = mongoose.model('Ingresante', IngresanteSchema).plural('ingresantes');
