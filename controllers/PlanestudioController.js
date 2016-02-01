var model = require('../models/PlanestudioModel.js');
var auth = require('../config/passport');

module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Planestudio');
      controller.relations(true);
      controller.hints(true);
      controller.fragment('/planestudios');
      //custom methods
      controller.query('get',function (request, response, next) {
        request.baucis.query.populate([{path:'_escuela'},{path:'_escuela',populate:{path:'_facultad'}}]);
        next();
      });


      controller.get('/methods/paginate', function(req, res){
      	var limit = parseInt(req.query.count);
      	var page = parseInt(req.query.page) || 1;
      	var filter = req.query.filter;
        for (var key in filter) {
          switch (key) {
            case 'codigo':
            case 'nombre':
              filter[key] = new RegExp(filter[key],'i');
              break;
            case '_escuela':
              if(parseInt(filter[key])===0)
                filter[key] = null;
              break;
          }
        }
      	model.paginate(
      		filter,
      		{
            page: page,
            limit: limit,
            populate: ['_escuela','_periodo']
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

      controller.put('/methods/change/:estado/:id',auth.ensureAuthenticated, function(req, res,next){
        model.findOne({_id:req.params.id},function(error,data){
          if(error) return res.status(500).send({error:error});
          data.estado = req.params.estado;
          data.historial.push({created_at:new Date(),estado:data.estado});
          data.save(function(error,data){
            return res.status(200).send(data);
          });
        });
      });

    }
  };
};
