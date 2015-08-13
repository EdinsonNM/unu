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
      controller.post('/login/register', function(req,res){
        model.signup("admin2@admin.com","admin","en",function(err,user){
          if(err) return res.send(err);
          return res.send(user);
        });
      });
      controller.post('/auth/login', function(req,res,next){
        passport.authenticate('local', function(err, user, info) {
          if (err) { return next(err) }
          if (!user) {
            return res.json(401, { success:false, message: 'Usuario o Contraseña incorrectos' });
          }
          //user has authenticated correctly thus we create a JWT token
          var obj={
            _id:user._id,
            username:user.username,
            email:user.email
          }
          var token = jwt.sign(obj, config.key_secret);
          res.status(200).json({ token : token, success:true });

        })(req, res, next);
      });

      controller.get('/auth/me',auth.ensureAuthenticated,function(req,res){
        res.send(req.token);
      });

    }
  }
}
