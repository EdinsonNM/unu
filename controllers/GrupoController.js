var model = require('../models/GrupoModel.js');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){
      var controller=baucis.rest('Grupo');
      controller.fragment('/grupos');

      controller.post('/seed/data', function(req,res,next){
        model.remove({}, function(err) {
           console.log('grupo removed');
        });

        var grupo1=new model({
          nombre:'Administrador',
          codigo:'ADMIN',
          menu:[
            {
              order:1,
              title:'Mantenimiento',
              url:'',
              children:[
                {title:'Facultad',icon:'',url:'app.facultad',order:1},
                {title:'Periodos',icon:'',url:'app.periodos',order:2},
                {title:'Plan de Estudios',icon:'',url:'app.planestudios',order:3},
                {title:'Cursos',icon:'',url:'app.cursos',order:4}
              ]
            }
          ]
        });

        grupo1.save();
        var grupo2=new model({nombre:'Jefe de Departamento',codigo:'JEFE_DPTO'});
        grupo2.save();
        var grupo3=new model({nombre:'Docente',codigo:'DOCENTE'});
        grupo3.save();
        var grupo4=new model({nombre:'Alumno',codigo:'ALUMNO'});
        grupo4.save();

        res.send({ok:'ok'});
        next();
      });
    }
  };
};
