var model = require('../models/EscuelaModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Escuela');
      controller.relations(true);
      controller.hints(true);
    }
  }
}
