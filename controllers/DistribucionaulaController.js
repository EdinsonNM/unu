var model = require('../models/DistribucionaulaModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Distribucionaula');
      controller.relations(true);
      controller.hints(true);
    }
  };
};
