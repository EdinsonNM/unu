var model = require('../models/UsuarioModel.js');
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;
module.exports = function(){
  console.log('setear password..');
model.find({},function(error,data){
  if(error) return console.warn(error);
  data.forEach(function(item){
    item.password = "abc";
    item.save();
    /*bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if(err) return console.log(err);
      bcrypt.hash(item.username, salt, function(err, hash) {
        if(err) return console.log(err);
        model.update({_id:item._id}, { password: hash,salt:salt }, function(){
          console.log('update...');

        });
      });
    });*/


  });

});
};
