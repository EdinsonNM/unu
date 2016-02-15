var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var GrupoCursoSchema = new Schema({
    codigo: {
        type: String,
        required: true
    },
    _cursoAperturadoPeriodo: {
        type: Schema.Types.ObjectId,
        ref: 'CursoAperturadoPeriodo',
        required: true
    },
    grupo: {
        type: String,
        enum: ['A', 'B', 'C']
    },
    matriculados:Number,
    inscritos:Number,
    retiroParcial:Number,
    retiroTotal:Number,
    nivel:Number,//Definir Variable
    estado: {
        type: String,
        enum: ['Abierto', 'Cerrado'],
        default: 'Abierto'
    },
    createdAt: Date,
    updatedAt: Date
});

GrupoCursoSchema.plugin(mongoosePaginate);
GrupoCursoSchema.pre('save', function(next) {
    var now = new Date();
    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }grupoCursoSchema
    next();
});
module.exports = mongoose.model('GrupoCurso', GrupoCursoSchema).plural('grupoCursos');
