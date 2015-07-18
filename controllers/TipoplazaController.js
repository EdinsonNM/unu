var model = require('../models/TipoplazaModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Tipoplaza');
      controller.relations(true);
      controller.hints(true);
    }
  }
}
