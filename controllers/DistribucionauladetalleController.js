var model = require('../models/DistribucionauladetalleModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Distribucionauladetalle');
      controller.relations(true);
      controller.hints(true);
    }
  };
};
