var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var DocenteSchema = new Schema({
  nombres: {
    type: String,
    required: true
  },
  apellidos: {
    type: String,
    required: true
  },
  _facultad:{
    type:Schema.Types.ObjectId,
    ref:'Facultad',
    required:true
  },
  created_at: Date,
  updated_at: Date
});
DocenteSchema.plugin(mongoosePaginate);
DocenteSchema.plugin(uniqueValidator);
DocenteSchema.pre('save', function(next) {
  var now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

module.exports = mongoose.model('Docente', DocenteSchema).plural('docentes');
