var model = require('../models/PlazaasignaturaModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Plazaasignatura');
      controller.relations(true);
      controller.hints(true);
    }
  };
};
