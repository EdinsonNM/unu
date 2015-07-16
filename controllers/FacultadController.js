var model = require('../models/FacultadModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Facultad');
      controller.fragment('/facultades');
    }
  }
}
