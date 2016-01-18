/*
Parametro: Define los tipos de parametros que seran incluidos para cada periodo o escuela
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var ParametroSchema = new Schema({
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
        ref: 'Escuela',
        default: true
    },
    activoPeriodo: {
        type: Boolean,
        ref: 'Escuela',
        default: true
    },
    created_at: Date,
    updated_at: Date
});

ParametroSchema.plugin(mongoosePaginate);
ParametroSchema.plugin(uniqueValidator);
ParametroSchema.pre('save', function(next) {
    var now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

module.exports = mongoose.model('Parametro', ParametroSchema).plural('parametros');
