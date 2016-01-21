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
                console.log(request.body)
                model.find({
                    _escuela: request.body._escuela,
                    _periodo: request.body._periodo
                }, function (err, result){

                  if(err) return response.status(500).send({message:err});
                  console.log("Hubieron resultados:");
                  //console.log(procesoescuela);

                  if(result && result.length>0){
                      procesoescuela = result[0];
                      procesoescuela.procesos.push({
                          _proceso: request.body.proceso._id,
                          inicio: request.body.inicio,
                          fin: request.body.fin,
                          estado: request.body.estado
                      });
                      procesoescuela.save(function(err, data){
                          if(err){
                              return response.status(500).send({error: err});
                          }
                          return response.status(202).send(data);
                      });
                  }else{
                      //Insertar y guardar arreglo.
                      request.body.procesos = [];
                      request.body.procesos.push({
                          _proceso: request.body.proceso._id,
                          inicio: request.body.inicio,
                          fin: request.body.fin,
                          estado: request.body.estado
                      });
                      next();
                  }
                });
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
