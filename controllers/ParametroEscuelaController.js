var model = require('../models/ParametroEscuelaModel.js');
var auth = require('../config/passport');

module.exports = function() {
    var baucis = require('baucis');
    return {
        setup: function() {
            var controller = baucis.rest('ParametroEscuela');
            controller.relations(true);
            controller.hints(true);
            controller.fragment('/parametrosescuelas');

            //Primero busco de acuerdo a la escuela y periodo
            //Si existe: hacer push en su arreglo parametros
            //Sino guardar todo


            controller.request('post', function (request, response, next) {
                console.log(request.body)
                model.findOne({
                    _escuela: request.body._escuela,
                    _periodo: request.body._periodo
                }, function (err, parametroescuela){
                  if(err) return response.status(500).send({message:err});
                  if(parametroescuela){
                      parametroescuela.parametros.push({
                          _parametro: request.body.parametro._id,
                          valor: request.body.valor
                      });
                      parametroescuela.save(function(err, data){
                          if(err){
                              return response.status(500).send({error: err});
                          }
                          return response.status(202).send(data);
                      });
                  }else{
                      //Insertar y guardar arreglo.
                      request.body.parametros = [];
                      request.body.parametros.push({
                          _parametro: request.body.parametro._id,
                          valor: request.body.valor
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
                        limit: limit,
                        populate: ['parametros._parametro']
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
