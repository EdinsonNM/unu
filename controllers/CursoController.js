
var model = require('../models/CursoModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Curso');
      controller.relations(true);
      controller.hints(true);
    }
  }
}
