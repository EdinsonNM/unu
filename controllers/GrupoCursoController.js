var model = require('../models/GrupoCursoModel.js');
var CursoAperturadoPeriodo=require('../models/CursoAperturadoPeriodoModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('GrupoCurso');
      controller.fragment('/grupocursos');

      controller.request('post', function (request, response, next) {
        //var fileId = new ObjectID(request.body._cursoAperturadoPeriodo);
      var fileId = new ObjectID(request.body._cursoAperturadoPeriodo);
        //var fileType = req.header('X-File-Type');
        //var fileName = req.header('X-File-Name');
        //var uniqId = req.param('uniqId', request.body._cursoAperturadoPeriodo);

        CursoAperturadoPeriodo.findOne({_id:fileId},function(err,aperturados){
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
      controller.get('/methods/paginate', function(req, res) {
        var limit = parseInt(req.query.count);
        var page = parseInt(req.query.page) || 1;
        var filter = req.query.filter;
        model.paginate(
          filter, {
            page: page,
            limit: limit
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
