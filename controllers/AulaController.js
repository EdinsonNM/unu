var model = require('../models/AulaModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Aula');
      controller.relations(true);

      controller.get('/methods/paginate', function(req, res){
      	var limit = req.query.limit;
      	var page = req.query.page;
      	var filters = req.query.filters;
      	model.paginate(
      		filters, 
      		{page: page, limit: limit}, 
      		function(err, results, pageCount, itemCount){
      			res.send(results);
      		}
      	);
      });
    }
  }
}
