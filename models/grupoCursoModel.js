var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var GrupoCursoSchema = new Schema({
    _cursoAperturadoPeriodo: {
        type: Schema.Types.ObjectId,
        ref: 'CursoAperturadoPeriodo',
        required: true
    },
    _seccion:{
        type: Schema.Types.ObjectId,
        ref: 'Seccion',
        required: true
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
    updatedAt: Date,
    programaciones:[{
      type: Schema.Types.ObjectId,
      ref: 'ProgramacionGrupoCurso',
      required: true
    }]
});

GrupoCursoSchema.plugin(mongoosePaginate);
GrupoCursoSchema.pre('save', function(next) {
    var now = new Date();
    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});
module.exports = mongoose.model('GrupoCurso', GrupoCursoSchema).plural('grupocursos');
