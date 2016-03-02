var model = require('../models/AvanceCurricularModel.js');
module.exports = function() {
  var baucis = require('baucis');
  return {
    setup: function() {
      var controller = baucis.rest('AvanceCurricular');
      controller.relations(true);
      controller.hints(true);
      controller.fragment('/avancecurriculars');

    }
  };
};
