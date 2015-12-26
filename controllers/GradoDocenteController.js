var model = require('../models/GradoDocenteModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('GradoDocente');
      controller.fragment('/gradodocentes');

      //custom methods

      controller.get('/methods/paginate', function(req, res){
        var limit = req.query.count;
        var page = req.query.page || 1;
        var filter = req.query.filter;
        for (var key in filter) {
          switch (key) {
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

      controller.post('/seed/data', function(req,res,next){
        /*model.remove({}, function(err) {
           console.log('Data de GradoDocente eliminada');
        });*/

        var grado1=new model({nombre:'BACHILLER'});
        grado1.save();
        var grado2=new model({nombre:'MAGISTER'});
        grado2.save();
        var grado3=new model({nombre:'DOCTOR'});
        grado3.save();
        var grado4=new model({nombre:'PHD'});
        grado4.save();
        res.send({success:'true', message:'Data creada correctamente en GradoDocente'});
        next();
      });
    }

  };
};
