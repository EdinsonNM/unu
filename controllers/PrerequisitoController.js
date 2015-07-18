var model = require('../models/PrerequisitoModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Prerequisito');
      controller.relations(true);
      controller.hints(true);
    }
  }
}
