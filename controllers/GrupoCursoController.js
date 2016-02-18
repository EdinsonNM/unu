var model = require('../models/GrupoCursoModel.js');
var CursoAperturadoPeriodo=require('../models/CursoAperturadoPeriodoModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('GrupoCurso');
      controller.fragment('/grupocurso');

      controller.request('post', function (request, response, next) {
        CursoAperturadoPeriodo.findOne({_id:request.body._cursoAperturadoPeriodo},function(err,aperturados){
          if(err) return response.status(500).send({message:'Ocurrio un error interno del servidor',detail:err});
          if(!aperturados) return response.status(404).send({message:'Curso no fue aperturado para este periodo'});
          model.find({_cursoAperturadoPeriodo:request.body._cursoAperturadoPeriodo},function(err,data){
            if(err) return response.status(500).send({message:'Ocurrio un error interno del servidor',detail:err});
            var seccion = _.findWhere(data, {_seccion:request.body._seccion});
            if(seccion) return response.status(412).send({message:'Grupo ya fue aperturado'});
            next();
          });
        });

      });
    }
  };
};
