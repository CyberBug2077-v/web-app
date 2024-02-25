const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // use name of user as a reference
    required: true
  },
  backgroundImage: {
    type: String,
    default: 'default_background_url'
  },
  description: {
    type: String,
    default: ''
  }

});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
