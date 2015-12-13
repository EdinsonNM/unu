var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var SilabusSchema = new Schema({
  _periodo:{
    type:Schema.Types.ObjectId,
    ref:'Periodo',
    required:true
  },
  _planestudioDetalle:{
    type:Schema.Types.ObjectId,
    ref:'Planestudiodetalle',
    required:true
  },
  identificacionAcademica: {
    duracion:{
      inicio:Date,
      fin:Date
    },
    areaCurricular:String
  },
  sumilla:String,
  unidadesDidacticas:[
  {
    numero:Number,
    titulo:String,
    competencia:String,
    criterios:[{
      criterios:String,
      conocimientos:String,
      evidencias:String
    }]
  }
  ],
  estrategiasAprendizaje:{
    ensenianza:String,
    aprendizaje:String,
    investigacionFormativa:String,
    responsabilidadSpcial:String
  },
  recursosDidacticos:String,
  evaluacionAprendizaje:[
  {
    unidad:Number,
    evidencias:{
      desempenio:{
        ponderado:Number,
        indicadores:String,
        tecnicas:String,
        instrumentos:String
      },
      conocimiento:{
        ponderado:Number,
        indicadores:String,
        tecnicas:String,
        instrumentos:String
      },
      producto:{
        ponderado:Number,
        indicadores:String,
        tecnicas:String,
        instrumentos:String
      }
    }
  }
  ],
  fuentesInformacion:String,
  created_at: Date,
  updated_at: Date
});
SilabusSchema.plugin(mongoosePaginate);
SilabusSchema.plugin(uniqueValidator);
SilabusSchema.pre('save', function(next) {
  var now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

module.exports = mongoose.model('Silabus', SilabusSchema).plural('silabus');
