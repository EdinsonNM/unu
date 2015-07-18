var model = require('../models/PeriodoModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Periodo');
      controller.relations(true);
      controller.hints(true);
    }
  }
}
