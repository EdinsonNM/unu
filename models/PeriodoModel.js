var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var PeriodoSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    anio: {
        type: Number,
        required: true
    },
    periodo: {
        type: Number,
        required: true
    },
    resolucion: {
        type: String,
        required: true
    },
    fechaResolucion: {
        type: Date,
        required: true
    },
    inicio: {
        type: Date,
        required: true
    },
    fin: {
        type: Date,
        required: true
    },
    procesos: [{
        _proceso: {
            type: Schema.Types.ObjectId,
            ref: 'Proceso',
            required: true
        },
        fechaInicio: Date,
        fechaFin: Date,
    }],
    parametros: [{
        _parametro: {
            type: Schema.Types.ObjectId,
            ref: 'Parametro',
            required: true
        },
        valor: String
    }],
    activo: {
        type: Boolean,
        enum: ['Activo', 'Inactivo'],
        default: 'Activo'
    },
    createdAt: Date,
    updatedAt: Date
});
PeriodoSchema.plugin(mongoosePaginate);
PeriodoSchema.pre('save', function(next) {
    var now = new Date();
    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('Periodo', PeriodoSchema).plural('periodos');
