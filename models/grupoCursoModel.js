var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var grupoCursoSchema = new Schema({
    codigo: {
        type: String,
        required: true
    },
    _cursoAperturadoPeriodo: {
        type: Schema.Types.ObjectId,
        ref: 'cursoAperturadoPeriodo',
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
    created_at: Date,
    updated_at: Date
});

grupoCursoSchema.plugin(mongoosePaginate);

grupoCursoSchema.pre('save', function(next) {
    var now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }grupoCursoSchema
    next();
});

module.exports = mongoose.model('grupoCurso', grupoCursoSchema).plural('grupoCursos');
