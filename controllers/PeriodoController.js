var model = require('../models/PeriodoModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Periodo');
      controller.fragment('/periodos');
      //custom methods
      controller.get('/methods/paginate', function(req, res){
      	var limit = parseInt(req.query.count);
      	var page = parseInt(req.query.page) || 1;
      	var filter = req.query.filter;
      	model.paginate(
      		filter,
      		{page: page, limit: limit},
      		function(err, results, pageCount, itemCount){
            var obj = {
              total: itemCount,
              perpage: limit*1,
              current_page: page*1,
              last_page: Math.ceil(itemCount/limit),
              from: (page-1)*pageCount+1,
              to: page*pageCount,
              data: results.docs
            };
      			res.send(obj);
      		}
      	);
      });
    }
  };
};
