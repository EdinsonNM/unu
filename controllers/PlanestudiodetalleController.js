var model = require('../models/PlanestudiodetalleModel.js');
var alumnomodel = require('../models/AlumnoModel.js');
var auth = require('../config/passport');
var Q = require('q');
var _ = require('underscore');
var ObjectId = require('mongoose').Types.ObjectId;

module.exports=function(){
  var baucis=require('baucis');

  return{
    setup:function(){
      var controller=baucis.rest('Planestudiodetalle');
      controller.relations(true);
      controller.hints(true);

      // middlewares
      controller.query('get',function (request, response, next) {
        request.baucis.query.populate(
          [{
            path:'_curso'
          },{
            path:'_requisitos',
            populate:{
              path:'_curso'
            }
          },{
            path:'_revisiones',
            populate:{
              path:'_user'
            }
          }]
        );
        next();
      });

      //custom methods
      controller.get('/methods/paginate', function(req, res){
      	var limit = parseInt(req.query.count);
      	var page = parseInt(req.query.page) || 1;
      	var filter = req.query.filter;
      	model.paginate(
      		filter,
      		{
            page: page,
            limit: limit,
            populate: [{path:'_planestudio'},{path:'_curso'},{path:'_requisitos',populate:{path:'_curso'}}]
          },
      		function(err, results){
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

      controller.get('/methods/aprobacion/:periodo', function(req, res){
      	var limit = parseInt(req.query.count);
      	var page = parseInt(req.query.page) || 1;
      	var filter = req.query.filter;
        var promises = [];
        var periodos = [];
        periodos.push(req.params.periodo);
      	model.paginate(
      		filter,
      		{
            page: page,
            limit: limit,
            populate: [
            {path:'_aprobacionesPeriodo',match:{_periodo:req.params.periodo}},
            {path:'_planestudio'},
            {path:'_curso'},
            {path:'_requisitos',populate:{path:'_curso'}}]
          },
      		function(err, results){
            var obj = {
              total: results.total,
              perpage: limit*1,
              current_page: page*1,
              last_page: results.pages,
              from: (page-1)*limit+1,
              to: page*limit,
              data: results.docs
            };
            res.status(200).send(obj);

      		});
      });

      /**
       * retorna los cursos que le toca al usuario enviado
       */
      controller.get('/methods/permitidos/:periodo', function(req, res){
      	var limit = parseInt(req.query.count);
      	var page = parseInt(req.query.page) || 1;
      	var alumno = req.query.alumno;
      	var filter = req.query.filter;
        var promises = [];
        var periodos = [];
        periodos.push(req.params.periodo);

        alumnomodel.findOne({_id:alumno}, function(error,data){
          if(error)
            return res.status(500).send({error:error});

          model.paginate(
        		filter,
        		{
              page: page,
              limit: limit,
              populate: [{
                path:'_aprobacionesPeriodo',
                match:{
                  _periodo:req.params.periodo
                }
              },{
                path: '_planestudio'
              },{
                path: '_curso',
                model: 'Curso'
              }]
            },
        		function(err, results){
              var datos = [];
              results.docs.forEach(function(item){
                /**
                 * falta validar si el curso está aperturado para el periodo
                 */
              });
              var obj = {
                total: results.total,
                perpage: limit*1,
                current_page: page*1,
                last_page: results.pages,
                from: (page-1)*limit+1,
                to: page*limit,
                data: results.docs
              };
              res.status(200).send(obj);

        		});
        });
      });

      controller.post('/methods/comentarios/:id',auth.ensureAuthenticated, function(req, res,next){
        model.findOne({_id:req.params.id},function(error,data){
          if(data._revisiones)
          data._revisiones.push({created_at:new Date(),comentario:req.body.comentario,_user:req._user});
          data.save(function(error,data){
            return res.status(200).send(data);
          });
        });
      });
      controller.put('/methods/change/:estado/:id',auth.ensureAuthenticated, function(req, res,next){
        model.findOne({_id:req.params.id},function(error,data){
          if(error) return res.status(500).send({error:error});
          data.estado = req.params.estado;
          data.save(function(error,data){
            return res.status(200).send(data);
          });
        });
      });
      controller.post('/methods/equivalencia/:id', function(request, response, next){
          model.findByIdAndUpdate(
              request.params.id,
              {$push: {"_equivalencias": request.body.equivalencia}},
              {safe: true},
              function(err, model){
                  if(err) return response.status(500).send({message:err});
                  response.status(200).send(model);
              }
          );
      });
    }
  };
};
