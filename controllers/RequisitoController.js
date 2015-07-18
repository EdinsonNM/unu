var model = require('../models/RequisitoModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Requisito');
      controller.relations(true);
      controller.hints(true);
    }
  }
}
