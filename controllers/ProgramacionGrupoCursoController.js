var model = require('../models/ProgramacionGrupoCursoModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('ProgramacionGrupoCurso');
      controller.relations(true);
      controller.hints(true);
      //nombre servicio
      controller.fragment('/programaciongrupocursos');
    }
  };
};
