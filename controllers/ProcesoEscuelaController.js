var model = require('../models/ProcesoEscuelaModel.js');
var auth = require('../config/passport');

module.exports = function() {
    var baucis = require('baucis');
    return {
        setup: function() {
            var controller = baucis.rest('ProcesoEscuela');
            controller.relations(true);
            controller.hints(true);
            controller.fragment('/procesosescuelas');

            controller.request('post', function (request, response, next) {
              request.baucis.outgoing(function (context, callback) {
                model.find({
                    _escuela: context.doc._escuela._id,
                    _periodo: context.doc._periodo._id
                }, function (err, procesoescuela){
                  if(err) return response.status(500).send({message:err});
                  if(procesoescuela){
                      procesoescuela._procesos.push({
                          _proceso: context.doc._proceso._id,
                          inicio: context.doc.inicio,
                          fin: context.doc.fin,
                          estado: context.doc.estado,
                      });
                      procesoescuela.save(function(){
                        callback(null, context);
                      });
                  }else{
                      //Insertar y guardar arreglo.
                  }
                });
              });
              next();
            });


            controller.get('/methods/paginate', function(req, res) {
                var limit = parseInt(req.query.count);
                var page = parseInt(req.query.page) || 1;
                var filter = req.query.filter;
                var _escuela = req.query._escuela;
                var _periodo = req.query._periodo;

                model.paginate(
                    filter, {
                        page: page,
                        limit: limit
                    },

                    function(err, results, pageCount, itemCount) {
                        var obj = {
                            total: results.total,
                            perpage: limit * 1,
                            current_page: page * 1,
                            last_page: results.pages,
                            from: (page - 1) * limit + 1,
                            to: page * limit,
                            data: results.docs
                        };
                        res.send(obj);
                    }
                );
            });

        }
    };
};
