var model = require('../models/FichaMatriculaModel.js');
var CursoAperturado = require('../models/CursoAperturadoPeriodoModel.js');
var Alumno = require('../models/AlumnoModel.js');

var auth = require('../config/passport');

module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('FichaMatricula');
      controller.fragment('/fichamatriculas');

      //custom methods

      controller.get('/methods/fichamatricula', function(req, res){
        var cursosDisponibles = [];
        var periodo = req.body._periodo;
        var alumno = req.body._alumno;
        Alumno.findOne({_id:alumno},function(err,alumno){
          model.findOne({_periodo:periodo,_alumno:alumno})
          .populate([{path:'_detalles'}])
          .exec(function(err,matricula){
            CursoAperturado.find({_periodo:periodo,_escuela:alumno._escuela})
            .populate('_grupos')
            .then(function(err,aperturados){
              matricula._detalles.forEach(function(detalle,index){
                if(detalle._planestudiodetalle===cursoAperturado._planestudiodetalle){
                  cursosDisponibles.push(cursoAperturado);
                }
              });
              return res.status(200).send(cursosDisponibles);
            });
          });
        });

      });
    }
  };
};
