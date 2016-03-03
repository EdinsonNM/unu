var model = require('../models/ProgramacionGrupoCursoModel.js');
var Parent = require('../models/GrupoCursoModel.js');

var _= require('underscore');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('ProgramacionGrupoCurso');
      controller.fragment('/programaciongrupocursos');

      controller.request('post', function (request, response, next) {
        Parent.findOne({_id:request.body._grupoCurso},function(err,grupo){
          if(err) return response.status(500).send({message:'Ocurrio un error interno del servidor',detail:err});
          if(!grupo) return response.status(404).send({message:'Grupo no existe'});
          model.find({_grupoCurso:request.body._grupoCurso},function(err,data){
            if(err) return response.status(500).send({message:'Ocurrio un error interno del servidor',detail:err});
            var titular;
            if(request.body.modalidadDocente==='Titular')
              titular = _.findWhere(data, {modalidadDocente:'Titular'});
            if(titular) return response.status(412).send({message:'Solo puede asignarse un docente como titular'});
            next();
          });
        });

        request.baucis.outgoing(function (context, callback) {
          Parent.update({
            _id: context.doc._grupoCugrso},
            {$push: {_programaciones:context.doc}},
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
            { _id: detalle._grupoCurso },
            { $pull: { '_programaciones':  {$in:detalles } } },
            {safe:true},
            function(err, obj){
                if(err) return response.status(500).send({message:err});
                next();
            });
        });

      });

      controller.get('/methods/paginate', function(req, res) {
        var limit = parseInt(req.query.count) || 1000;
        var page = parseInt(req.query.page) || 1;
        var filter = req.query.filter;
        model.paginate(
          filter, {
            page: page,
            limit: limit,
            populate: [{
              path : '_grupoCurso',
              model : 'GrupoCurso',
              populate : [{
                path :'_cursoAperturadoPeriodo',
                model : 'CursoAperturadoPeriodo',
                populate : [{
                  path : '_planestudiodetalle',
                  model : 'Planestudiodetalle',
                  populate : [{
                    path : '_curso',
                    model : 'Curso'
                  }]
                }]
              },{
                path : '_seccion',
                model : 'Seccion'
              }]
            },{
              path : '_aula',
              model : 'Aula',
              populate : [{
                path : '_pabellon',
                model : 'Pabellon'
              }]
            },{
              path : '_docente',
              model : 'Docente'
            }
            ]
          },

          function(err, results, pageCount, itemCount) {
            var datos = results.docs.map(function(item){
              item._doc._nombre_curso = item._grupoCurso._cursoAperturadoPeriodo._planestudiodetalle._curso.nombre;
              item._doc._codigo_curso = item._grupoCurso._cursoAperturadoPeriodo._planestudiodetalle._curso.codigo;
              item._doc._grupo_curso = item._grupoCurso._seccion.nombre;
              return item;
            });
            var obj = {
              total: results.total,
              perpage: limit*1,
              current_page: page*1,
              last_page: results.pages,
              from: (page-1)*limit+1,
              to: page*limit,
              data: datos
            };
            res.send(obj);
          }
        );
      });

      /**
       * nuevo endpoint para los filtros
       */
      controller.get('/methods/paginate/filter', function(req, res) {
        var limit = parseInt(req.query.count);
        var page = parseInt(req.query.page) || 1;
        var filter = req.query.filter;
        var conditions = req.query.conditions;
        model.paginate(
          {}, {
            page: page,
            limit: limit,
            populate: [{
              path : '_grupoCurso',
              model : 'GrupoCurso',
              populate : [{
                path :'_cursoAperturadoPeriodo',
                model : 'CursoAperturadoPeriodo',
                populate : [{
                  path : '_planestudiodetalle',
                  model : 'Planestudiodetalle',
                  populate : [{
                    path : '_curso',
                    model : 'Curso'
                  }]
                }]
              },{
                path : '_seccion',
                model : 'Seccion'
              }]
            },{
              path : '_aula',
              model : 'Aula',
              populate : [{
                path : '_pabellon',
                model : 'Pabellon'
              }]
            },{
              path : '_docente',
              model : 'Docente'
            }
            ]
          },

          function(err, results, pageCount, itemCount) {
            var datos = [];
            results.docs.forEach(function(item){
              if(item._grupoCurso._cursoAperturadoPeriodo._planestudiodetalle && item._grupoCurso._cursoAperturadoPeriodo._planestudiodetalle._planestudio == filter._planestudio){
                item._doc._nombre_curso = item._grupoCurso._cursoAperturadoPeriodo._planestudiodetalle._curso.nombre;
                item._doc._codigo_curso = item._grupoCurso._cursoAperturadoPeriodo._planestudiodetalle._curso.codigo;
                item._doc._grupo_curso = item._grupoCurso._seccion.nombre;
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
              data: datos
            };
            res.send(obj);
          }
        );
      });

    }
  };
};
