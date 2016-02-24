var model = require('../models/GrupoCursoModel.js');
var Parent=require('../models/CursoAperturadoPeriodoModel.js');
var message = require('../commons/messages');
var _ = require('underscore');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('GrupoCurso');
      controller.fragment('/grupocursos');

      controller.request('post', function (request, response, next) {
        Parent.findOne({_id:request.body._cursoAperturadoPeriodo},function(err,cursoAperturado){
          if(err) return response.status(500).send({message:message.ERROR.INTERNAL_SERVER,detail:err});
          if(!cursoAperturado) return response.status(404).send({message:'No se encontro el curso aperturado'});
          model.find({_cursoAperturadoPeriodo:request.body._cursoAperturadoPeriodo},function(err,data){
            if(err) return response.status(500).send({message:message.ERROR.INTERNAL_SERVER,detail:err});
            var seccion = _.findWhere(data, {_seccion:request.body._seccion});
            if(seccion) return response.status(412).send({message:'Grupo ya fue aperturado'});
            next();
          });
        });

        request.baucis.outgoing(function (context, callback) {
          Parent.update({
            _id: context.doc._cursoAperturadoPeriodo},
            {$push: {_grupos:context.doc}},
            function(err){
                if(err) return response.status(500).send({message:err});
                callback(null, context);
            });

        });
      });

      controller.request('delete', function (request, response, next) {
        model.findById(request.params.id, function (err, detalle){
          var detalles = [];
          detalles.push(detalle._id );
          Parent.update(
            { _id: detalle._planestudiodetalle },
            { $pull: { '_grupos':  {$in:detalles } } },
            {safe:true},
            function(err, obj){
                if(err) return response.status(500).send({message:err});
                next();
            });
        });

      });

      controller.get('/methods/paginate', function(req, res) {
        var limit = parseInt(req.query.count);
        var page = parseInt(req.query.page) || 1;
        var filter = req.query.filter;
        model.paginate(
          filter, {
            page: page,
            limit: limit,
            populate: [
            {path:'_programaciones'},
            {path:'_cursoAperturadoPeriodo',
               populate:{
                  path:'_planestudiodetalle',
                  model:"Planestudiodetalle",
                  populate:{
                     path:'_curso',
                     model:"Curso"
                  }
               }
            },
            {path:'_seccion'}]
          },

          function(err, results, pageCount, itemCount) {
            var obj = {
              total: results.total,
              perpage: limit*1,
              current_page: page*1,
              last_page: results.pages,
              from: (page-1)*limit+1,
              to: page*limit,
              data: results.docs
            };
            res.send(obj);
          }
        );
      });
    }
  };
};
