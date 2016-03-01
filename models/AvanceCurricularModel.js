var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var AvanceCurricularSchema = new Schema({
  secuencia:Number,
  _alumno:{
    type:Schema.Types.ObjectId,
    ref:'Alumno',
    required:true
  },
  _planEstudios:{
    type:Schema.Types.ObjectId,
    ref:'Planestudio',
    required:true
  },
  detalleAvance:[{
    _planEstudiosDetalle:{
      type:Schema.Types.ObjectId,
      ref:'Planestudiodetalle',
      required:true
    },
    numeroVeces:{
      type: Number,
      default:0
    },
    record:[{
      secuencia:Number,
      _periodo:{
        type:Schema.Types.ObjectId,
        ref:'Periodo'
      },
      situacion:{
        type:String,
        enum:['Matriculado','Retirado','Convalidado','Aprobado','Desaprobado']
      },
      notaParcial:Number,
      notaPractica:Number,
      notaLaboratorio:Number,
      notaTrabajo:Number,
      notaFinal:Number,
      notaPromedio:Number,
      notaPromedioRedondeado:Number
    }]
  }],
  activo:{
    type:Boolean,
    default:true
  },
  createdAt: Date,
  updatedAt: Date
});
AvanceCurricularSchema.plugin(mongoosePaginate);
AvanceCurricularSchema.plugin(uniqueValidator);
AvanceCurricularSchema.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});
module.exports = mongoose.model('AvanceCurricular', AvanceCurricularSchema).plural('avancecurriculars');
