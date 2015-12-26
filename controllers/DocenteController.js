var model = require('../models/DocenteModel.js');
var Usuario = require('../models/UsuarioModel.js');

module.exports = function() {
  var baucis = require('baucis');
  return {
    setup: function() {
      var controller = baucis.rest('Docente');
      controller.fragment('/docentes');

      //custom methods

      controller.request('post', function (request, response, next) {
        if(request._usuario){
          //TODO verificar exitencia de usuario, si existe devolver error 400: BAD REQUEST message: Usuario ya existe
          var usuario = new Usuario(request._usuario);
          usuario.save(function(error, data){
            if(error) return response.status(500).send(error);
            request._usuario = data;
            next();
          });
        }

      });

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
