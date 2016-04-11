var model = require('../models/TipoSituacionAlumnoModel.js');
var auth = require('../config/passport');

module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('TipoSituacionAlumno');
      controller.fragment('/tiposituacionalumnos');

    }
  };
};
