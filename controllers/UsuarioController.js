var Grupo = require('../models/GrupoModel.js');
var model = require('../models/UsuarioModel.js');
var baucis=require('baucis');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var auth = require('../config/passport');
var config = require('../config/config');
var Q=require('q');
module.exports=function(){
  return{
    setup:function(){
      var controller=baucis.rest('Usuario');
      controller.fragment('/usuarios');

      //custom routes
      controller.post('/seed/data', function(req,res,next){
        model.remove({}, function(err) {
           console.log('usuario removed');
           Grupo.findOne({codigo:'ADMIN'},function(err,obj){
             console.log(obj);
             if(err) next(err);
             var user=new model({
               firstname:'Edinson',
               lastname:'Nuñez More',
               username:'admin',
               password:'admin',
               email:'admin@admin.com',
               _grupo:obj._id
             });
             user.save(function(err,u){
               res.status(200).send(u);
             });
           });

        });



      });
      controller.post('/auth/login', function(req,res,next){
        passport.authenticate('local', function(err, user, info) {
          if (err) { return next(err); }
          if (!user) {
            return res.json(401, { success:false, message: 'Usuario o Contraseña incorrectos' });
          }
          //user has authenticated correctly thus we create a JWT token
          var obj={
            _id:user._id,
            username:user.username,
            email:user.email,
            grupo_id:user._grupo
          };
          var token = jwt.sign(obj, config.key_secret);
          res.status(200).json({ token : token, success:true });

        })(req, res, next);
      });

      controller.get('/auth/me',auth.ensureAuthenticated,function(req,res,next){
        try {
          var decoded = jwt.verify(req.token,config.key_secret);
        }catch(err) {
          next(err);
        }
        model
        .findOne({ _id: decoded._id })
        .populate('_grupo').exec(function(err, user) {

          res.status(200).send({user:user});
          next();
        });

      });

      controller.get('/auth/access',auth.ensureAuthenticated,function(req,res,next){
        try {
          var decoded = jwt.verify(req.token,config.key_secret);
        }catch(err) {
          next(err);
        }

      });

      controller.put('/auth/change-password',auth.ensureAuthenticated,function(request,response,next){
        try {
          var decoded = jwt.verify(request.token,config.key_secret);
        }catch(err) {
          next(err);
          //return res.status(500).send({error:err});
        }
        //var decoded= {_id:'567ef477040c56e064433c27'};
        model
        .findOne({ _id: decoded._id })
        .populate('_grupo').exec(function(err, user) {
          //TODO VALIDAR CONTRASEÑAS si contraseñas no son inguales retornas status=400, message:'Contraseñas no coinciden'
          if(request.body.newPassword!=request.body.newPasswordRepeat){ return response.status(400).send({message:'Contraseñas no coinciden'}); }
          //contraseña anterior no es correcta, entonces 401 y contraseña es incorrecta
          user.comparePassword(request.body.password,function(err,isMatch){
            if (err) { return next(err); }
            if (isMatch) {
              //validar que contraseña no sea igual al nombre de Usuario
              if(user.username==request.body.newPassword){
                return response.status(400).send({message:'Contraseña no debe ser igual al nombre de Usuario'});
              }
              //si todo es ok retornas 200
              user.password = request.body.newPassword;
              user.save(function(error,data){
                response.status(200).send({user:user});
              });
            }
            else {
              return response.status(401).send({message:'Contraseña es incorrecta'});
            }
          });
          //next();
          //return response.status(200).send({password:user.password,name:user.username});
        });



        //INFO considerar recepcion de los siguientes parametros req.body.password,req.body.newPassword,req.body.newPasswordRepeat

      });

      var updatePassword = function(item){
        var defer = Q.defer();
        item.save(function(err,data){
          if(err) return defer.reject(err);
          defer.resolve(data);
        });
        return defer.promise;
      };
      controller.get('/auth/genratepasswords',function(req,res,next){
        var promises = [];
        model.find({},function(error,data){
          if(error) return res.status(500).send(error);
          for(var i = 0;i<data.length;i++){
            var item = data[i];
            if(item.username!='admin'){
              item.password = item.username;
              promises.push(updatePassword(item));
            }
          }
          Q.all(promises).then(function(results){
            res.status(202).send({total:results.length});
          });
        });

      });
    }
  };
};
