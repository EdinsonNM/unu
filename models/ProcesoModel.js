/*
Parametro: Define los tipos de parametros que seran incluidos para cada periodo o escuela
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var ProcesoSchema = new Schema({
    codigo: {
        type: String,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true
    },
    activoEscuela: {
        type: Boolean,
        ref: 'Escuela'
    },
    activoPeriodo: {
        type: Boolean,
        ref: 'Periodo'
    },
    createdAt: Date,
    updatedAt: Date
});

ProcesoSchema.plugin(mongoosePaginate);
ProcesoSchema.plugin(uniqueValidator);
ProcesoSchema.pre('save', function(next) {
    var now = new Date();
    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('Proceso', ProcesoSchema).plural('procesos');
