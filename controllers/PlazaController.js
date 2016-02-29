var model = require('../models/ConflictosalumnoModel.js');

module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){

      var controller=baucis.rest('Conflictosalumno');
      controller.relations(true);
      controller.hints(true);
    }
  };
};
