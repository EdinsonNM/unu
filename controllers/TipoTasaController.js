var model = require('../models/TipoTasaModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Tipotasa');
      controller.relations(true);
      controller.hints(true);
    }
  };
};
