var model = require('../models/HorarioModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Horario');
      controller.relations(true);
      controller.hints(true);
    }
  };
};
