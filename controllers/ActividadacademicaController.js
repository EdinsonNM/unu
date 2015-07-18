var model = require('../models/ActividadacademicaModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Actividadacademica');
      controller.relations(true);
      controller.hints(true);
    }
  }
}
