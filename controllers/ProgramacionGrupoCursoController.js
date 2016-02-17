var model = require('../models/ProgramacionGrupoCursoModel.js');
var GrupoCurso = require('../models/GrupoCursoModel.js');

var _= require('underscore');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('ProgramacionGrupoCurso');
      controller.fragment('/programaciongrupocursos');

      controller.request('post', function (request, response, next) {
        GrupoCurso.findOne({_id:request.body._grupoCurso},function(err,grupo){
          if(err) return response.status(500).send({message:'Ocurrio un error interno del servidor',detail:err});
          if(!grupo) return response.status(404).send({message:'Grupo no existe'});
          model.find({_grupoCurso:request.body._grupoCurso},function(err,data){
            if(err) return response.status(500).send({message:'Ocurrio un error interno del servidor',detail:err});
            var titular = _.findWhere(data, {modalidadDocente:'Titular'});
            if(titular) return response.status(412).send({message:'Solo puede asignarse un docente como titular'});
            next();
          });
        });

      });
    }
  };
};
