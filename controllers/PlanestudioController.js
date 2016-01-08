var model = require('../models/PlanestudioModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Planestudio');
      controller.relations(true);
      controller.hints(true);
      controller.fragment('/planestudios');
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
