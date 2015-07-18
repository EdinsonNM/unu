var model = require('../models/AulaModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Aula');
      controller.relations(true);
      controller.hints(true);
    }
  }
}
