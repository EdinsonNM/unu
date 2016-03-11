var model = require('../models/PersonaModel.js');

module.exports = function() {
    var baucis = require('baucis');
    return {
        setup: function() {
            var controller = baucis.rest('Persona');
            controller.fragment('/personas');

            //custom methods
            controller.get('/model/sexo', function(req, res, next) {
                var enumValues = model.schema.path('sexo').enumValues;
                res.status(200).send(enumValues);
            });
            controller.get('/model/tipodocumento', function(req, res, next){
              var enumValues = model.schema.path('tipoDocumento').enumValues;
              res.status(200).send(enumValues);
            });

            controller.get('/methods/paginate', function(req, res) {
                var limit = parseInt(req.query.count);
                var page = parseInt(req.query.page) || 1;
                var filter = req.query.filter;
                for (var key in filter) {
                    switch (key) {
                        case 'nombres':
                        case 'apellidos':
                            filter[key] = new RegExp(filter[key], 'i');
                            break;
                    }
                }
                model.paginate(
                    filter, {
                        page: page,
                        limit: limit
                    },
                    function(err, results) {
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
