var model = require('../models/TipocursoModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Tipocurso');
      controller.relations(true);
      controller.hints(true);
    }
  };
};
