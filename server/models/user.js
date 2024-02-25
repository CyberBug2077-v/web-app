const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    name: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      default: '/static/images/avatars/default.jpg'
    },
    description: {
      type: String,
      default: 'Tell others who are you!'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', function(next) {
    let user = this;
  
    // Only encrypt the password when user edit it
    if (!user.isModified('password')) return next();
  
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
  
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});


const User = mongoose.model('User', userSchema);
module.exports = User;
