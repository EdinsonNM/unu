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
