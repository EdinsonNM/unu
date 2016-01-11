var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/UsuarioModel.js');
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
      user.comparePassword(password, function(err, isMatch) {
        if (err) return done(err);
        if(isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Invalid password' });
        }
      });
    });
  }
));

// Simple route middleware to ensure user is authenticated.  Otherwise send to login page.
module.exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
    var token;
    var strAuthorization = req.headers.authorization;
    if (typeof strAuthorization !== 'undefined') {
        var authorization = strAuthorization.split(" ");
        if(authorization.length===2){
          req.key = authorization[0];
          req.token =authorization[1];
          console.log(req);
        }
        next();

    } else {
        res.send(403);
    }
};


// Check for admin middleware, this is unrelated to passport.js
// You can delete this if you use different method to check for admins or don't need admins
module.exports.ensureAdmin = function ensureAdmin(req, res, next) {
  console.log(req.user);
  if(req.user && req.user.admin === true)
      next();
  else
      res.send(403);
}
