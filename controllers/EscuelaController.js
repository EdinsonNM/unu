var model = require('../models/EscuelaModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Escuela');
      controller.relations(true);
      controller.hints(true);
      controller.fragment('/escuelas');

      //custom methods
      controller.get('/methods/paginate', function(req, res){
      	var limit = req.query.count;
      	var page = req.query.page || 1;
      	var filters = req.query.filters;
      	model.paginate(
      		filters,
      		{page: page, limit: limit},
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
  }
}
