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
    }
  };
};
