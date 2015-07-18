var model = require('../models/PlanestudiodetallegrupoModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Planestudiodetallegrupo');
      controller.relations(true);
      controller.hints(true);
    }
  }
}
