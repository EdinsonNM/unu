var model = require('../models/CompromisoPagoModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('CompromisoPago');
      controller.relations(true);
      controller.hints(true);
    }
  };
};
