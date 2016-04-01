var model = require('../models/ArchivoBancoModel.js');
var path = require('path');

module.exports = function() {
  var baucis = require('baucis');
  return {
    setup: function() {
      var controller = baucis.rest('ArchivoBanco');
      controller.relations(true);
      controller.hints(true);
      controller.fragment('/archivobancos');

      //custom methods
      controller.get('/methods/paginate', function(req, res) {
        var limit = parseInt(req.query.count);
        var page = parseInt(req.query.page) || 1;
        var filter = req.query.filter;
        //var tipoArchivo = req.query.tipoarchivo;

        //filter.push(tipoArchivo);
        model.paginate(
          filter, {
            page: page,
            limit: limit,
            populate: ['_pabellon']
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
      //ARCHIVOS DE SALIDA
      controller.post('/methods/download/:nombreArchivo', function(req, res) {
        var nomArchivo = req.params.nombreArchivo;
        pathFile = path.join(__dirname, '../', 'commons/data/exports', nomArchivo);
        res.download(pathFile);
      });
    }
  };
};
