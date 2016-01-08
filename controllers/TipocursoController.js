var model = require('../models/TipocursoModel.js');
module.exports=function(){
  var baucis=require('baucis');
  //hi
  return{
    setup:function(){
      var controller=baucis.rest('Tipocurso');
      controller.relations(true);
      controller.hints(true);
    }
  };
};
