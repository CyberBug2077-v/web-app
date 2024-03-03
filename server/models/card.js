const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Card references the id from User
    required: true
  },
  userName: {
    type: String,
    required: true // Set to true if you require a userName for every card
  },
  description: {
    type: String,
    default: ''
  },
  backgroundImage: {
    type: String,
    default: '' // Store the image as a Base64 string
  },
  avatarImage: {
    type: String,
    default: '' // Store the avatar as a Base64 string
  }
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
