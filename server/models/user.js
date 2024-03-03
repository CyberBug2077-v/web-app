const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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
      required: false
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



const User = mongoose.model('User', userSchema);
module.exports = User;
