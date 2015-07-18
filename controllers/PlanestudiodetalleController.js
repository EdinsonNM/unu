var model = require('../models/PlanestudiodetalleModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Planestudiodetalle');
      controller.relations(true);
      controller.hints(true);
    }
  }
}
