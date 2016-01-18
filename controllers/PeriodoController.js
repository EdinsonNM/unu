var model = require('../models/PeriodoModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Periodo');
      controller.fragment('/periodos');

      controller.put('updatePeriodoProcesos', function(request, response, next){
          model.findByIdAndUpdate(
              request.params._id,
              {$push: {"procesos": {
                  _proceso: request.params._proceso,
                  fechaInicio: request.params.fechaInicio,
                  fechaFin: request.params.fechaFin
              }}},
              {safe: true},
              function(err, model){
                  console.log(err);
                  if(err) return response.status(500).send({message:err});
              }
          );
      });

      controller.put('updatePeriodoParametros', function(request, response, next){
          model.findByIdAndUpdate(
              request.params._id,
              {$push: {"parametros": {
                  _proceso: request.params._parametro,
                  valor: request.params.valor
              }}},
              {safe: true},
              function(err, model){
                  console.log(err);
                  if(err) return response.status(500).send({message:err});
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
      controller.get('/methods/paginate', function(req, res){
      	var limit = parseInt(req.query.count);
      	var page = parseInt(req.query.page) || 1;
      	var filter = req.query.filter;
      	model.paginate(
      		filter,
      		{page: page, limit: limit},
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
    }
  };
};
