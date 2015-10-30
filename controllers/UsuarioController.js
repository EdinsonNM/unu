var Grupo = require('../models/GrupoModel.js');
var model = require('../models/UsuarioModel.js');
var baucis=require('baucis');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var auth = require('../config/passport');
var config = require('../config/config');
module.exports=function(){
  return{
    setup:function(){
      var controller=baucis.rest('Usuario');
      controller.fragment('/usuarios');

      //custom routes
      controller.post('/seed/data', function(req,res,next){
        model.remove({}, function(err) {
           console.log('grupo removed');
        });
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
            res.send(u);
            next();
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

    }
  };
};
