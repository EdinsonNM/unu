var model = require('../models/ConflictosAlumnoModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('ConflictosAlumno');
      controller.relations(true);
      controller.hints(true);
    }
  };
};