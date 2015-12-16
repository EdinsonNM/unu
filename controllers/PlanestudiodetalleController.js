var model = require('../models/PlanestudiodetalleModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Planestudiodetalle');
      controller.relations(true);
      controller.hints(true);

      controller.query(function (request, response, next) {
        request.baucis.query.deepPopulate('_curso');
        next();
      });

      //custom methods
      controller.get('/methods/paginate', function(req, res){
      	var limit = req.query.count;
      	var page = req.query.page || 1;
      	var filter = req.query.filter;
      	model.paginate(
      		filter,
      		{
            page: page,
            limit: limit,
            populate: ['_planestudio','_curso']
          },
      		function(err, results, pageCount, itemCount){
            var obj = {
              total: itemCount,
              perpage: limit*1,
              current_page: page*1,
              last_page: Math.ceil(itemCount/limit),
              from: (page-1)*pageCount+1,
              to: page*pageCount,
              data: results
            };
      			res.send(obj);
      		}
      	);
      });
    }
  };
};
