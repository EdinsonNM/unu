var model = require('../models/AulaModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Aula');
      controller.relations(true);

      controller.get('/methods/paginate', function(req, res){        
      	var limit = req.query.limit;
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
