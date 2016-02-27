var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');

var TasaSchema = new Schema({
  _tipoTasa:{
    type:Schema.Types.ObjectId,
    ref:'Tipotasa'
  },
  codigo:String,
  historial:[
    {
      createdAt:{
        type:Date,
    		required:true
      },
      updateAt:{
        type:Date,
    		required:true
      },
      importe:Number,
      activo:{
        type:Boolean,
    		required:true,
        default:true
      }
    }
  ],
	nombre : {
		type:String,
		required:true
	},
  activo:{
    type:Boolean,
		required:true,
    default:true
  },
	createdAt:Date,
	updatedAt:Date
});

TasaSchema.pre('save',function(next){
	var now = new Date();
	this.updatedAt = now;
	if (!this.createdAt){
		this.createdAt=now;
	}
	next();
});
TasaSchema.plugin(mongoosePaginate);
TasaSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Tasa', TasaSchema).plural('tasas');
