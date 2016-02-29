var model = require('../models/CompromisopagoModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Compromisopago');
      controller.relations(true);
      controller.hints(true);
    }
  };
};
