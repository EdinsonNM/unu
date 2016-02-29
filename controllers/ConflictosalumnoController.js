var model = require('../models/ConflictosalumnoModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){

      var controller=baucis.rest('Conflictosalumno');
      controller.relations(true);
      controller.hints(true);

      /*** RETORNA LOS CONFLICTOS POR ALUMNO***/
      controller.get('/methods/conflicto', function(req, res) {
        var limit = parseInt(req.query.count);
        var page = parseInt(req.query.page) || 1;
        var filter = req.query.filter;
        model.paginate(
          filter, {
            page: page,
            limit: limit,
            populate:[
               {
                  path:'_conflicto'
               }
               // },
               // {
               //    path:'_alumno',
               //    populate:{
               //       path: '_persona',
               //       model:"Persona"
               //    }
               // }
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
      // var controller=baucis.rest('Conflictosalumno');
      // controller.relations(true);
      // controller.hints(true);
    }
  };
};
