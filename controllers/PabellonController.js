var model = require('../models/PabellonModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Pabellon');
      controller.relations(true);
      controller.hints(true);
    }
  }
}
