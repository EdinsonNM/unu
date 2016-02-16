var model = require('../models/CursoAperturadoPeriodoModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('CursoAperturadoPeriodo');
      controller.relations(true);
      controller.hints(true);
    }
  };
};
