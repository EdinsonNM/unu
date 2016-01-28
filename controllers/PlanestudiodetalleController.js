var model = require('../models/PlanestudiodetalleModel.js');
var acpmodel = require('../models/AprobacionCursoPeriodoModel.js');
var auth = require('../config/passport');
var Q = require('q');

module.exports=function(){
  var baucis=require('baucis');

  return{
    setup:function(){
      var controller=baucis.rest('Planestudiodetalle');
      controller.relations(true);
      controller.hints(true);



      // middlewares
      controller.query('get',function (request, response, next) {
        request.baucis.query.populate([{path:'_curso'},{path:'_requisitos',populate:{path:'_curso'}},{path:'_revisiones',populate:{path:'_user'}}]);
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

      controller.get('/methods/withCursos', function(req, res){
      	var limit = parseInt(req.query.count);
      	var page = parseInt(req.query.page) || 1;
      	var filter = req.query.filter;
        var promises = [];

      	model.paginate(
      		filter,
      		{
            page: page,
            limit: limit,
            populate: [{path:'_planestudio'},{path:'_curso'},{path:'_requisitos',populate:{path:'_curso'}}]
          },
      		function(err, results){
                var reqIdPeriodo = req.query._periodo;
                var total = results.docs.length;

                results.docs.forEach(function(item, index){
                    promises.push(acpmodel.findOne({
                            _periodo: reqIdPeriodo,
                            _planestudios: item._planestudio._id,
                            _curso: item._curso._id
                        }).exec().then((function(item,err, obj){
                            if(err) return err;
                            if(obj){
                                item._doc.aprobacioncursosperiodo = obj;
                            }else{
                                item._doc.aprobacioncursosperiodo = false;
                            }
                            return item._doc;
                        }).bind(null, item)));

                });

                Q.all(promises).then(function(result){
                    var obj = {
                      total: results.total,
                      perpage: limit*1,
                      current_page: page*1,
                      last_page: results.pages,
                      from: (page-1)*limit+1,
                      to: page*limit,
                      data: result
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

      //Metodo para aprobar curso.
      controller.post('/methods/aprobar', auth.ensureAuthenticated, function(req, res, next) {
        
          acpmodel.findOne({
              _periodo: req.body._periodo,
              _planestudios: req.body._planestudios,
              _curso: req.body._curso
          }, function(error, model) {
              if (error) return res.status(500).send({error: error});
              if (model) {
                  model.remove(function(err, obj){
                      if(err) return res.status(500).send({error: err});
                      return res.status(200).send();
                  });
              } else {
                  var objAcpmodel = new acpmodel({
                      _periodo: req.body._periodo,
                      _planestudios: req.body._planestudios,
                      _curso: req.body._curso
                  });
                  objAcpmodel.save(function(err, model){
                      if(err) return res.status(500).send({error: err});
                      return res.status(200).send(model);
                  });
              }
          });
      });

    }
  };
};
