var model = require('../models/GrupoCursoModel.js');
var Parent = require('../models/CursoAperturadoPeriodoModel.js');
var AvanceCurricular = require('../models/AvanceCurricularModel.js');
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
            var seccion = _.find(data,function(item){ return item._seccion.toString() == request.body._seccion._id; });
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
            { _id: detalle._cursoAperturadoPeriodo },
            { $pull: { '_grupos':  {$in:detalles } } },
            {safe:true},
            function(err, obj){
                if(err) return response.status(500).send({message:err});
                next();
            });
        });

      });

      /**
       * lista los grupo cursos agrupados por nombre_curso, codigo_curso, idPeriodo y idPlanestudio
       * Este endpoint es usado en horarios
       */
      controller.get('/methods/paginate', function(req, res) {
        var limit = parseInt(req.query.count);
        var page = parseInt(req.query.page) || 1;
        var filter = req.query.filter;
        var conditions = req.query.conditions;
        model.paginate(
          filter, {
            page: page,
            limit: limit,
            populate: [{
              path:'_programaciones'
            },{
              path:'_cursoAperturadoPeriodo',
              populate:[{
                path:'_planestudiodetalle',
                model:"Planestudiodetalle",
                populate:{
                   path:'_curso',
                   model:"Curso"
                }
              }]
            },
            {path:'_seccion'}]
          },
          function(err, results, pageCount, itemCount) {

            var datos = [];
            results.docs.forEach(function(item){
              if(item._cursoAperturadoPeriodo._planestudiodetalle && item._cursoAperturadoPeriodo._planestudiodetalle._planestudio == conditions._planestudio){
                item._doc._nombre_curso = item._cursoAperturadoPeriodo._planestudiodetalle._curso.nombre;
                item._doc._codigo_curso = item._cursoAperturadoPeriodo._planestudiodetalle._curso.codigo;
                item._doc._idPeriodo = item._cursoAperturadoPeriodo._periodo;
                item._doc._idPlanestudio = item._cursoAperturadoPeriodo._planestudiodetalle._planestudio;
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

      /**
       * lista los grupo cursos agrupados por nombre_curso, codigo_curso, idPeriodo y idPlanestudio
       * Este endpoint es usado en matrícula
       */
       var auxMatricula = function(item){
         item._doc._nombre_curso = item._cursoAperturadoPeriodo._planestudiodetalle._curso.nombre;
         item._doc._codigo_curso = item._cursoAperturadoPeriodo._planestudiodetalle._curso.codigo;
         item._doc._idPeriodo = item._cursoAperturadoPeriodo._periodo;
         item._doc._idPlanestudio = item._cursoAperturadoPeriodo._planestudiodetalle._planestudio;
         return item;
       };
       var auxSort = function(a, b){
         if(a.secuencia < b.secuencia){
           return 1;
         }else if(a.secuencia > b.secuencia){
           return -1;
         }else{
           return 0;
         }
       };
      controller.get('/methods/matricula', function(req, res) {
        var limit = parseInt(req.query.count);
        var page = parseInt(req.query.page) || 1;
        var filter = req.query.filter;
        var conditions = req.query.conditions;
        model.paginate(
          filter, {
            page: page,
            limit: limit,
            populate: [{
              path:'_cursoAperturadoPeriodo',
              model: 'CursoAperturadoPeriodo',
              populate:[{
                path: '_planestudiodetalle',
                model: 'Planestudiodetalle',
                populate:{
                   path:'_curso',
                   model: 'Curso'
                }
              }]
            }]
          },
          function(err, results, pageCount, itemCount) {

            var objAlumno;
            var record;
            var auxItem;
            var situaciones_aceptadas = ['Aprobado', 'Convalidado', 'Matriculado'];
            objAlumno = AvanceCurricular.findOne({'_alumno' : conditions._alumno}, function(err, alumno){
              var detalleAvance = alumno.detalleAvance;
              var datos = [];
              var planesEstudiosID = [];
              results.docs.forEach(function(item){
                console.log(item);
                if(item._cursoAperturadoPeriodo._planestudiodetalle && item._cursoAperturadoPeriodo._planestudiodetalle._planestudio == conditions._planestudio){
                  if(detalleAvance.length > 0){
                    detalleAvance.forEach(function(detalle){
                      if(detalle.record.length > 0){
                        record = detalle.record.sort(auxSort)[0];
                      }else{
                        record = null;
                      }
                      if(detalle._planEstudiosDetalle != item._cursoAperturadoPeriodo._planestudiodetalle._id){
                        if(planesEstudiosID.indexOf(item._cursoAperturadoPeriodo._planestudiodetalle._id) < 0){
                          planesEstudiosID.push(item._cursoAperturadoPeriodo._planestudiodetalle._id);
                          auxItem = auxMatricula(item);
                          datos.push(auxItem);
                        }
                      }else{
                        if(!record){
                          if(planesEstudiosID.indexOf(item._cursoAperturadoPeriodo._planestudiodetalle._id) < 0){
                            planesEstudiosID.push(item._cursoAperturadoPeriodo._planestudiodetalle._id);
                            auxItem = auxMatricula(item);
                            datos.push(auxItem);
                          }
                        }else if(situaciones_aceptadas.indexOf(record.situacion) < 0){
                          if(planesEstudiosID.indexOf(item._cursoAperturadoPeriodo._planestudiodetalle._id) < 0){
                            planesEstudiosID.push(item._cursoAperturadoPeriodo._planestudiodetalle._id);
                            auxItem = auxMatricula(item);
                            datos.push(auxItem);
                          }
                        }
                      }
                    });
                  }else{
                    var auxItem = auxMatricula(item);
                    datos.push(auxItem);
                  }
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
            });
          }
        );
      });

    }
  };
};
