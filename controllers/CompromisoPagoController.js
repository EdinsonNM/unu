var model = require('../models/CompromisopagoModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Compromisopago');
      controller.relations(true);
      controller.hints(true);

      /****RETORNA PAGOS PENDIENTES POR ALUMNO***/

      controller.get('/methods/deudas', function(req, res) {
        var limit = parseInt(req.query.count);
        var page = parseInt(req.query.page) || 1;
        var filter = req.query.filter;
        model.paginate(
          filter, {
            page: page,
            limit: limit,
            populate:[
               {
                  path:'_persona',
                  populate: {
                     path: '_alumno',
                     model:"Alumno"
                  }
               }
            ]
          },

          function(err, results, pageCount, itemCount) {
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

      controller.get('/methods/paginate/filtrado', function(req, res) {
        var limit = parseInt(req.query.count);
        var page = parseInt(req.query.page) || 1;
        var filter = req.query.filter;
        var conditional = req.query.conditional;
        model.paginate(
          conditional, {
            page: page,
            limit: limit,
            populate:[
               {
                  path:'_persona',
                  populate: {
                     path: '_alumno',
                     model:"Alumno"
                  }
               }
            ]
          },

          function(err, results, pageCount, itemCount) {
             var datos = [];
             results.docs.forEach(function(item){
               if(filter._ == item._doc._persona._alumno._id ){
                  datos.push(item);
               }
             });

            var obj = {
              total: results.total,
              perpage: limit*1,
              current_page: page*1,
              last_page: results.pages,
              from: (page-1)*limit+1,
              to: page*limit,
            //   data: results.docs
              data: datos
            };
            res.send(obj);
          }
        );
      });


    }
  };
};
