var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var PlanestudiodetalleSchema = new Schema({
    codigo: {
        type: String,
        required: true
    },
    creditos: {
        type: Number,
        required: true
    },
    horas_teoria: {
        type: Number,
        required: true
    },
    horas_practica: {
        type: Number,
        required: true
    },
    horas_laboratorio: {
        type: Number,
        required: true
    },
    horas_total: {
        type: Number,
        required: true
    },
    ciclo: {
        type: Number,
        required: true
    },
    _curso: {
        type: Schema.Types.ObjectId,
        ref: 'Curso',
        required: true
    },
    _planestudio: {
        type: Schema.Types.ObjectId,
        ref: 'Planestudio',
        required: true
    },
    _requisitos: [{
        type: Schema.Types.ObjectId,
        ref: 'Planestudiodetalle',
    }],
    estado: {
        type: String,
        enum: ['Registrado', 'Observado', 'Aprobado'],
        default: 'Registrado'
    },
    _revisiones: [{
        createdAt: {
            type: Date
        },
        comentario: String,
        _user: {
            type: Schema.Types.ObjectId,
            ref: 'Planestudiodetalle',
        }
    }],
    _equivalencias: [{
        type: Schema.Types.ObjectId,
        ref: 'Planestudiodetalle',
    }],
    _aprobacionesPeriodo:[{
        type: Schema.Types.ObjectId,
        ref: 'CursoAperturadoPeriodo',
    }],
    createdAt: Date,
    updatedAt: Date
});

PlanestudiodetalleSchema.plugin(mongoosePaginate);

PlanestudiodetalleSchema.pre('save', function(next) {
    var now = new Date();
    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('Planestudiodetalle', PlanestudiodetalleSchema).plural('planestudiodetalles');
