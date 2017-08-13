var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var userSchema = new mongoose.Schema({
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    fname:{
      type: String,
      required: true,
      trim: true
    },
    lname:{
      type: String,
      required: true,
      trim: true
    },
    daddy:{
      type: String,
      required: true,
      trim: true
    },
    userid:{
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    accno:{
      type: Number,
      required: true,
      trim: true,
      unique: true
    },
    rupee:{
      type: Number,
      trim: true,
    }

});

//authenticatin input on database
userSchema.statics.authenticate = function(userid, password, callback){
  user.findOne({userid : userid})
    .exec(function(error, user){
      if(error){
        console.log(error);
        return callback(error);
      }else if( !user ){
        var err =new Error('User not found.');
        err.status = 401;
        console.log(err);
        return callback(err);
      }
      bcrypt.compare(password, user.password, function(error, result){
        if(result === true){
          return callback(null, user);
        } else{
          return callback();
        }
      });
    });
}

//hashing password before saving to database
userSchema.pre('save', function(next){
  var user = this;
  bcrypt.hash(user.password, 10, function(err, hash){
    if(err){
      return next(err);
    }
    user.password = hash;
    next();
  });
});
var user = mongoose.model('user', userSchema);
module.exports = user;



//its a bit late but better use monk than mongoose its easier and faster than mongoose sry but i havent learned it yet
