var model = require('../models/AprobacionCursoPeriodoModel.js');
var auth = require('../config/passport');

module.exports = function() {
    var baucis = require('baucis');
    return {
        setup: function() {
            var controller = baucis.rest('AprobacionCursoPeriodo');
            controller.relations(true);
            controller.hints(true);
            controller.fragment('aprobacioncursosperiodo');

            // middlewares
            controller.query('get', function(request, response, next) {
                console.log("get simple");
                request.baucis.query.populate([{
                    path: '_curso'
                }, {
                    path: '_requisitos',
                    populate: {
                        path: '_curso'
                    }
                }, {
                    path: '_revisiones',
                    populate: {
                        path: '_user'
                    }
                }]);
                next();
            });

            //custom methods
            controller.get('/methods/paginate', function(req, res) {
                var limit = parseInt(req.query.count);
                var page = parseInt(req.query.page) || 1;
                var filter = req.query.filter;
                model.paginate(
                    filter, {
                        page: page,
                        limit: limit,
                        populate: [{
                            path: '_periodo'
                        }, {
                            path: '_planestudios'
                        }, {
                            path: '_requisitos',
                            populate: {
                                path: '_curso'
                            }
                        }]
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


            controller.post('/methods/aprobar/', auth.ensureAuthenticated, function(req, res, next) {
                model.findOne({
                    _periodo: req.params._periodo,
                    _planestudios: req.params._planestudios,
                    _curso: req.params._curso,
                }, function(error, model) {
                    if (error) return res.status(500).send({
                        error: error
                    });
                    if (model) {
                        model.delete();
                    } else {
                        model.save();
                    }
                });
            });
        }
    };
};
