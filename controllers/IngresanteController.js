var model = require('../models/IngresanteModel.js');

module.exports = function() {
  var baucis = require('baucis');
  return {
    setup: function() {
      var controller = baucis.rest('Ingresante');
      controller.fragment('/ingresantes');

      controller.get('/model/sexo', function(req, res, next){
        var enumValues = model.schema.path('sexo').enumValues;
        res.status(200).send(enumValues);
      });

      controller.get('/model/tipodocumento', function(req, res, next){
        var enumValues = model.schema.path('documentoIdentidad.tipo').enumValues;
        res.status(200).send(enumValues);
      });

      controller.get('/model/estado', function(req, res, next){
        var enumValues = model.schema.path('estado').enumValues;
        res.status(200).send(enumValues);
      });

      controller.post('/updateEstadoAprIngresante', function(request, response, next){
              if(request.body._id){
                model.findByIdAndUpdate(
                  request.body._id,
                  { estado: 'Aprobado' },
                  { safe: true },
                  function(err, data){
                    if(err) return response.status(500).send({message:err});
                    response.status(200).send(data);
                  }
                );
                /*
                var selIngresante = new Ingresante(request.body);
                selIngresante.estado = 'Aprobado';
                selIngresante.save(function(err, data){
                    if(err){ return response.status(500).send({error: err}); }
                    return response.status(202).send(data);
                });
                */
              }else{
                model.find({
                  _periodo: request.body._periodo,
                  _escuela: request.body._escuela,
                  estado: 'Registrado'
                },function(err, ingresantes){
                  if(err){ return response.status(500).send({error: 'No hay ingresantes registrados.'}); }
                  ingresantes.forEach(function(objIngresante){
                    objIngresante.estado = 'Aprobado';
                    objIngresante.save(function(err2, data){
                        if(err2){ return response.status(500).send({err2: err}); }
                        return response.status(202).send(data);
                    });
                  });
                });

              }

            });

      controller.get('/methods/paginate', function(req, res) {
        var limit = parseInt(req.query.count);
        var page = parseInt(req.query.page) || 1;
        var filter = req.query.filter;
        model.paginate(
          filter, {
            page: page,
            limit: limit,
            populate: ['_modalidad', '_escuela', '_facultad', '_periodo']
          },
          function(err, results) {
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
