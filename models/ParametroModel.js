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
    createdAt: Date,
    updatedAt: Date
});

ParametroSchema.plugin(mongoosePaginate);
ParametroSchema.plugin(uniqueValidator);
ParametroSchema.pre('save', function(next) {
    var now = new Date();
    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('Parametro', ParametroSchema).plural('parametros');
