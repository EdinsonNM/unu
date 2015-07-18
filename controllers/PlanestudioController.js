var model = require('../models/PlanestudioModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Planestudio');
      controller.relations(true);
      controller.hints(true);
    }
  }
}
