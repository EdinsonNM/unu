var model = require('../models/GrupoModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Grupo');
      controller.fragment('/grupos');
    }
  }
}
