var model = require('../models/EscuelaModel.js');
var Facultad = require('../models/FacultadModel.js');
module.exports = function() {
  var baucis = require('baucis');
  return {
    setup: function() {
      var controller = baucis.rest('Escuela');
      controller.relations(true);
      controller.hints(true);
      controller.fragment('/escuelas');

      controller.request('post', function (request, response, next) {
        request.baucis.outgoing(function (context, callback) {
          Facultad.findById(context.doc._facultad, function (err, facultad){
            if(err) return response.status(500).send({message:err});
            facultad._escuelas.push(context.doc._id);
            facultad.save(function(){
              callback(null, context);
            });
          });
        });
        next();
      });

      controller.request('delete', function (request, response, next) {
        model.findById(request.params.id, function (err, escuela){
          console.log(escuela);
          var escuelas = [];
          escuelas.push(escuela._id );
          Facultad.update(
            { _id: escuela._facultad },
            { $pull: { '_escuelas':  {$in:escuelas } } },
            {safe:true},
            function(err, obj){
                console.log('delete escuela...',err, obj);
            });
          next();
        });
      });

      //custom methods
      controller.get('/methods/paginate', function(req, res) {
        var limit = parseInt(req.query.count);
        var page = parseInt(req.query.page) || 1;
        var filter = req.query.filter;
        var _facultad = req.query._facultad;
        model.paginate(
          filter, {
            page: page,
            limit: limit,
            populate: ['_facultad'],
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
    }
  };
};
