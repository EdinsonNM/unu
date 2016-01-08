var model = require('../models/FacultadModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Facultad');
      controller.fragment('/facultades');

      //custom methods

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
          }
        }
      	model.paginate(
      		filter,
      		{page: page, limit: limit},
      		function(err, results, pageCount, itemCount){
            console.log(err, results, pageCount, itemCount);
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
