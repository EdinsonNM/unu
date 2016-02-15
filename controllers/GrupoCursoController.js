var model = require('../models/GrupoCursoModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('GrupoCurso');
      controller.relations(true);
      controller.hints(true);
    }
  };
};
