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
    activoEscuela: [{
        type: Boolean,
        ref: 'Escuela'
    }],
    activoPeriodo: [{
        type: Boolean,
        ref: 'Periodo'
    }],
    created_at: Date,
    updated_at: Date
});

ProcesoSchema.plugin(mongoosePaginate);
ProcesoSchema.plugin(uniqueValidator);
ProcesoSchema.pre('save', function(next) {
    var now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

module.exports = mongoose.model('Proceso', ProcesoSchema).plural('procesos');
