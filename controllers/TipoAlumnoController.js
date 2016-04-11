var model = require('../models/TipoAlumnoModel.js');
var auth = require('../config/passport');

module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('TipoAlumno');
      controller.fragment('/tipoalumnos');

    }
  };
};
