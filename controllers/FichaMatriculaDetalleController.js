var model = require('../models/FichaMatriculaDetalleModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('FichaMatriculaDetalle');
      controller.fragment('/fichamatriculadetalles');
    }
  };
};
