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
        var _periodo = req.query._periodo;
        var _alumno = req.query._alumno;
        Alumno.findOne({_id:_alumno},function(err,alumno){
          console.log(_periodo);
          console.log(_alumno);
          model.findOne({_periodo:_periodo,_alumno:_alumno})
          .populate([{path:'_detalles'}])
          .exec(function(err,matricula){
            console.log(matricula);
            CursoAperturado.find({_periodo:_periodo,_escuela:alumno._escuela})
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
