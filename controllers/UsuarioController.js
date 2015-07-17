var model = require('../models/UsuarioModel.js');
var baucis=require('baucis');
var jwt=require('jwt-simple');
var passport = require('passport');
var config = require('../config/config');
module.exports=function(){
  return{
    setup:function(){
      var controller=baucis.rest('Usuario');
      controller.fragment('/usuarios');

      //custom routes
      controller.post('/login/register', function(req,res){
        model.signup("admin2@admin.com","admin","en",function(err,user){
          if(err) return res.send(err);
          return res.send(user);
        });
      });
      controller.get('/login/authenticate', function(req,res,next){
        passport.authenticate('local', function(err, user, info) {
          if (err) { return next(err) }
          if (!user) {
            return res.json(401, { error: 'Usuario o Contraseña incorrectos' });
          }

          //user has authenticated correctly thus we create a JWT token
          var token = jwt.encode(user, config.key_secret);
          res.json({ token : token });

        })(req, res, next);
      });

    }
  }
}
