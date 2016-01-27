var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var AprobacionCursoPeriodoSchema = new Schema({
    _periodo: {
        type: Schema.Types.ObjectId,
        ref: 'Periodo',
        required: true
    },
    _planestudios: {
        type: Schema.Types.ObjectId,
        ref: 'Planestudio',
        required: true
    },
    _curso: {
        type: Schema.Types.ObjectId,
        ref: 'Planestudiodetalle',
        required: true
    },
    /*_estado:{
        type: String,
        enum: ['Dictado', 'No Dictado'],
        default: 'Dictado'
    }*/
    created_at: Date,
    updated_at: Date

});
AprobacionCursoPeriodoSchema.plugin(mongoosePaginate);
AprobacionCursoPeriodoSchema.pre('save', function(next) {
    var now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

module.exports = mongoose.model('AprobacionCursoPeriodo', AprobacionCursoPeriodoSchema).plural('aprobacioncursoperiodos');
