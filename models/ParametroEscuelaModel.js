/*
Parametro: Define los tipos de parametros que seran incluidos para cada periodo o escuela
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var ParametroEscuelaSchema = new Schema({
    _escuela: {
        type: Schema.Types.ObjectId,
        ref: 'Escuela',
        required: true
    },
    _periodo: {
        type: Schema.Types.ObjectId,
        ref: 'Periodo',
        required: true
    },
    parametros: [{
        _parametro: {
            type: Schema.Types.ObjectId,
            ref: 'Parametro',
            required: true
        },
        valor: String
    }],
    createdAt: Date,
    updatedAt: Date
});
ParametroEscuelaSchema.plugin(mongoosePaginate);
ParametroEscuelaSchema.plugin(uniqueValidator);
ParametroEscuelaSchema.pre('save', function(next) {
    var now = new Date();
    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('ParametroEscuela', ParametroEscuelaSchema).plural('parametrosescuelas');
