var mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    Schema   = mongoose.Schema,
    SALT_WORK_FACTOR = 10;

var UsuarioSchema = new Schema({
	username:{type:String, required:true},
  password:{type:String, required:true},
  firstname:String,
  lastname:String,
  email:{type:String, required:true},
  _grupo:{
    type:Schema.Types.ObjectId,
    ref:'Grupo',
    required:true
  },
  salt:String,
	createdAt:Date,
	updatedAt:Date
});


// Bcrypt middleware
UsuarioSchema.pre('save', function(next) {
	var user = this;
  var now = new Date();
  user.updatedAt = now;
  if (!user.createdAt){
    user.createdAt=now;
  }

	if(!user.isModified('password')) return next();
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if(err) return next(err);
    user.salt=salt;
		bcrypt.hash(user.password, salt, function(err, hash) {
			if(err) return next(err);
			user.password = hash;
      console.log('update password:'+user.username);
			next();
		});
	});
});

// Password verification
UsuarioSchema.methods.comparePassword  = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if(err) return cb(err);
		cb(null, isMatch);
	});
};

module.exports = mongoose.model('Usuario', UsuarioSchema);
