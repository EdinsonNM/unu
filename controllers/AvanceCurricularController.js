var model = require('../models/AvanceCurricularModel.js');
module.exports = function() {
  var baucis = require('baucis');
  return {
    setup: function() {
      var controller = baucis.rest('AvanceCurricular');
      controller.relations(true);
      controller.hints(true);
      controller.fragment('/avancecurriculars');
      controller.get('/methods/planestudios/:id',function(req,res,next){
        model
        .findOne({_alumno:req.params.id})
        .populate([
          {
            path:'_planEstudios',
            model:'Planestudio'
          },
          {
            path:'detalleAvance._planEstudiosDetalle',
            model:'Planestudiodetalle',
            populate:{
              path:'_curso',
              model:'Curso'
            }
          }]).exec(function(err, planestudio) {
          if(err) return res.status(500).send({message:'Error Interno del Servidor',detail:err});
          if(!planestudio) return res.status(404).send({message:'No se encontro plan de estudio'});
          res.status(200).send(planestudio);
          next();
        });
    });
    }
  }
}
