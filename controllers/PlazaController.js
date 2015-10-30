var model = require('../models/PlazaModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Plaza');
      controller.relations(true);
      controller.hints(true);
    }
  };
};
