var model = require('../models/UsuarioModel.js');
var baucis=require('baucis');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var config = require('../config/config');
module.exports=function(){
  return{
    setup:function(){
      var controller=baucis.rest('Usuario');
      controller.fragment('/usuarios');

      var allowCrossDomain = function (req, res, next) {
          res.header('Access-Control-Allow-Origin', "http://localhost");
          res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
          res.header('Access-Control-Allow-Headers', 'Content-Type');
          next();
      };


      //custom routes
      controller.post('/login/register', function(req,res){
        model.signup("admin2@admin.com","admin","en",function(err,user){
          if(err) return res.send(err);
          return res.send(user);
        });
      });
      controller.get('/auth/login', function(req,res,next){
        passport.authenticate('local', function(err, user, info) {
          if (err) { return next(err) }
          if (!user) {
            return res.json(401, { success:false, message: 'Usuario o Contraseña incorrectos' });
          }

          //user has authenticated correctly thus we create a JWT token
          var token = jwt.sign(user, config.key_secret);
          res.status(200).json({ token : token, success:true });

        })(req, res, next);
      });

    }
  }
}
