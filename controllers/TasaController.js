var model = require('../models/TasaModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Tasa');
      controller.relations(true);
      controller.hints(true);
    }
  };
};
