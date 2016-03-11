var model = require('../models/OtrasDeudasAlumnoModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Otrasdeudasalumno');
      controller.fragment('/otrasdeudasalumnos');
      //custom methods
      controller.get('/methods/validate-unique', function(req, res){
        var obj={};
        obj[req.query.attribute] = req.query.value;
        model.findOne(obj,function(error,data){
          if(data){ return res.status(200).send({success:false}); }
          return res.status(200).send({success:true});
        });
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
          }
        }
      	model.paginate(
      		filter,
      		{page: page, limit: limit},
      		function(err, results, pageCount, itemCount){
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

    }
  };
};
