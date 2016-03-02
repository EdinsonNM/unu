var model = require('../models/PeriodoModel.js');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Periodo');
      controller.fragment('/periodos');

      controller.query(function (request, response, next) {
        request.baucis.query.sort({anio:-1,periodo:-1});
        next();
      });

      controller.post('/updatePeriodoProceso', function(request, response, next){
          model.findByIdAndUpdate(
              request.body._periodo,
              {$push: {"procesos": {
                  _proceso: request.body.proceso._id,
                  fechaInicio: request.body.fechaInicio,
                  fechaFin: request.body.fechaFin
              }}},
              {safe: true},
              function(err, model){
                  if(err) return response.status(500).send({message:err});
                  response.status(200).send(model);
              }
          );
      });

      controller.post('/updatePeriodoParametro', function(request, response, next){
          model.findByIdAndUpdate(
              request.body._periodo,
              {$push: {"parametros": {
                  _parametro: request.body._parametro._id,
                  valor: request.body.valor
              }}},
              {safe: true},
              function(err, model){
                  if(err) return response.status(500).send({message:err});
                  response.status(200).send(model);
              }
          );
      });

      //custom methods
      controller.request('post put', function (request, response, next) {
        request.baucis.outgoing(function (context, callback) {
          if(context.doc.activo){
            model.update({ _id: { $nin: [context.doc._id ]}}, { $set: { activo: false } },{multi:true},function(error){
              if(error) return response.status(500).send({message:error});
              callback(null, context);
            });
          }else{
            callback(null, context);
          }
        });
        next();
      });

      controller.get('/methods/paramproc/:id', function(req, res){
      	var id = req.params.id;
        console.log(id);
        model.findOne({_id:id})
        .populate('procesos._proceso parametros._parametro')
        .exec(function(error,data){
          console.log(data);
          if(error) return res.status(500).send({error:error});
          if(data)  return res.status(200).send({procesos:data.procesos,parametros:data.parametros});
          return res.status(404).send();
        });

      });

      controller.get('/methods/paginate', function(req, res){
      	var limit = parseInt(req.query.count);
      	var page = parseInt(req.query.page) || 1;
      	var filter = req.query.filter;
      	model.paginate(
      		filter,
      		{page: page, limit: limit,sort:{anio:-1,periodo:-1}},
      		function(err, results, pageCount, itemCount){
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

      /**
       * devuelve el último periodo registradoº
       */
       controller.get('/lastPeriodo', function(req, res){
       	var filter = {activo: true};
       	model.paginate(
       		filter,
       		{
            limit: 1,
            sort:{
              $natural: -1
            }
          },
       		function(err, results, pageCount, itemCount){
       			res.send(results.docs);
       		}
       	);
       });

    }
  };
};
