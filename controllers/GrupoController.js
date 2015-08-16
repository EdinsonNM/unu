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

        var user=new model({nombre:'Administrador',codigo:'ADMIN'});
        user.save();
        var user2=new model({nombre:'Jefe de Departamento',codigo:'JEFE_DPTO'});
        user2.save();
        var user3=new model({nombre:'Docente',codigo:'DOCENTE'});
        user3.save();
        var user4=new model({nombre:'Alumno',codigo:'ALUMNO'});
        user4.save();

        res.send({ok:'ok'});
        next();
      });
    }
  }
}
