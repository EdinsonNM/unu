var model = require('../models/AlumnoModel.js');
module.exports = function() {
  var baucis = require('baucis');
  return {
    setup: function() {
      var controller = baucis.rest('Alumno');
      controller.fragment('/alumnos');

      //custom methods

      controller.get('/methods/paginate', function(req, res) {
        var limit = req.query.count;
        var page = req.query.page || 1;
        var filter = req.query.filter;
        model.paginate(
          filter, {
            page: page,
            limit: limit,
            populate: ['_facultad']
          },
          function(err, results, pageCount, itemCount) {
            var obj = {
              total: itemCount,
              perpage: limit * 1,
              current_page: page * 1,
              last_page: Math.ceil(itemCount / limit),
              from: (page - 1) * pageCount + 1,
              to: page * pageCount,
              data: results
            };
            res.send(obj);
          }
        );
      });

    }
  };
};
