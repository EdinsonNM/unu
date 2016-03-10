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

      controller.get('/methods/paginate/filtrado', function(req, res) {
        var limit = parseInt(req.query.count);
        var page = parseInt(req.query.page) || 1;
        var filter = req.query.filter;
        var conditional = req.query.conditional;
        model.paginate(
          conditional, {
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
             var datos = [];
             results.docs.forEach(function(item){
               if(filter._periodo == item._doc._periodo && filter._planestudio == item._doc._planestudiodetalle._planestudio ){
                  datos.push(item);
               }
             });

            var obj = {
              total: results.total,
              perpage: limit*1,
              current_page: page*1,
              last_page: results.pages,
              from: (page-1)*limit+1,
              to: page*limit,
            //   data: results.docs
              data: datos
            };
            res.send(obj);
          }
        );
      });

      controller.get('/methods/listacursosingresante', function(req, res) {
        var _alumno = req.query._alumno;
        var _periodo = req.query._periodo;
        var _escuela = req.query._escuela;
        model.find({_periodo : _periodo})
        .populate(
          [{
            path:'_grupos',
            populate: {
              path: '_seccion',
              model: 'Seccion'
            }
          },{
            path: '_planestudiodetalle',
            populate: [{
              path: '_curso',
              model: 'Curso'
            },{
              path: '_planestudio',
              model: 'Planestudio'
            }]
          }]
        )
        .exec(function(err, aperturados){
          if(err || !aperturados.length) return res.status(500).send('No se encontraron Cursos Aperturados');
          var fichaMatricula = {
            creditos: {
              maximo : {
                creditosmatricula: 0
              }
            },
            _periodo: _periodo,
            _alumno: _alumno,
            _escuela: _escuela,
            cursos: []
          };
          aperturados.forEach(function(aperturado){
            if((aperturado._planestudiodetalle.ciclo == '01' || aperturado._planestudiodetalle.ciclo == '1') && aperturado._grupos.length>0 && aperturado._planestudiodetalle._planestudio._escuela == _escuela){
              fichaMatricula.creditos.maximo.creditosmatricula+= aperturado._planestudiodetalle.creditos;
              fichaMatricula.cursos.push(aperturado);
            }
          });
          return res.status(200).send(fichaMatricula);
        });
      });

    }
  };
};
