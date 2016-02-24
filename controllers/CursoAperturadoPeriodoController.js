var model = require('../models/CursoAperturadoPeriodoModel.js');
var Parent = require('../models/PlanestudiodetalleModel.js');

module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('CursoAperturadoPeriodo');
      controller.fragment('/cursoaperturadoperiodos');


      controller.request('post', function (request, response, next) {
        request.baucis.outgoing(function (context, callback) {
          Parent.update({
            _id: context.doc._planestudiodetalle},
            {$push: {_aprobacionesPeriodo:context.doc}},
            function(err){
                if(err) return response.status(500).send({message:err});
                callback(null, context);
            });

        });
        next();
      });

      controller.request('delete', function (request, response, next) {
        model.findById(request.params.id, function (err, detalle){
          var detalles = [];
          detalles.push(detalle._id );
          Parent.update(
            { _id: detalle._planestudiodetalle },
            { $pull: { '_aprobacionesPeriodo':  {$in:detalles } } },
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
            populate:[
               {
                  path:'_grupos',
                  populate:{
                  path:'_seccion',
                  model: "Seccion"
                  }
               },
               {
                  path:'_planestudiodetalle',
                  populate:{
                     path:'_curso',
                     model:"Curso"
                  }
               }
            ]
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
