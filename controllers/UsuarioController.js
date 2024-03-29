var Grupo = require('../models/GrupoModel.js');
var model = require('../models/UsuarioModel.js');
var Alumno = require('../models/AlumnoModel.js');
var baucis=require('baucis');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var auth = require('../config/passport');
var config = require('../config/config');
var Q=require('q');
var crypto = require('crypto');
var messagesResponses = require('../commons/libs/responses/responses');
var Email = require('../commons/libs/email');

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

      controller.post('/auth/change-password-users',auth.ensureAuthenticated,function(request,response,next){
        if(request.isAuthenticated){
          model
          .findOne({ _id: request._user._id })
          .populate('_grupo').exec(function(err, userAdmin) {
            if(userAdmin._grupo.codigo=='ADMIN'){
              model
              .findOne({ _id: request.body._usuario })
              .exec(function(err, user) {
                if (err) { return response.status(500).send({message:'Ocurrio un error intenro del sistema',detail:err}); }
                user.password = request.body.password;
                user.save(function(err,result){
                  if (err) { return response.status(500).send({message:'Ocurrio un error intenro del sistema',detail:err}); }
                  return response.status(200).send();
                });

              });
            }else{
              return response.status(401).send({message:'No Autorizado'});
            }
          });
        }
      });

      controller .post('/auth/forgot',function(request,response){
        var email = request.body.email;
        if(email){
          Alumno.findOne({email:email},function(error,alumno){
            if(error) return messagesResponses.InternalError(response,error);
            if(!alumno) return messagesResponses.NotFound(response,'No se encontro ninguna coincidencia para el email ingresado');
            model.findOne({username:alumno.codigo},function(error,usuario){
              if(error) return messagesResponses.InternalError(response,error);
              if(!usuario) return messagesResponses.NotFound(response,'No se encontro el usuario');
              var token = crypto.randomBytes(32).toString('hex');
              usuario.resetPasswordToken = token;
              usuario.resetPasswordExpires =  Date.now() + 3600000;
              usuario.save(function(error,data){
                console.log("user saved...",error,data);
                if(error)  return messagesResponses.InternalError(response,error);
                Email(request,usuario,alumno,function(error){
                  if(error) return messagesResponses.InternalError(response,error);
                   response.status(200).send();
                });
               
              });
            });
          });
        }else{
          return messagesResponses.BadRequest(response,"Email es obligatorio");
        }
        
        
      });

      controller.get('/auth/resetpassword/:token',function(request,response){
       model.findOne({ resetPasswordToken: request.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) return messagesResponses.NotFound(response,'No se encontro el usuario');
          return response.status(200).send(user);
        });
      });

      controller.post('/auth/resetpassword/:token',function(request,response){
       model.findOne({ resetPasswordToken: request.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) return messagesResponses.NotFound(response,'No se encontro el usuario');
          user.password = req.body.password;
          user.resetPasswordToken = void 0;
          user.resetPasswordExpires = void 0;

          user.save(function(error) {
           if(error)  return messagesResponses.InternalError(response,error);
           return response.status(200).send({message:'Contraseña actualizada satisfactoriamente'});
          });
        });
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
