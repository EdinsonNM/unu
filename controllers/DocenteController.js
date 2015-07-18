var model = require('../models/DocenteModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Docente');
      controller.relations(true);
      controller.hints(true);
    }
  }
}
