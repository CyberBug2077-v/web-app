const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const User = require('../models/user');
const Card = require('../models/card');
const Chat = require('../models/chat');
const crypto = require('crypto');

// Helper function to hash a password
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}


mongoose.connect('mongodb://localhost:27017/projectdb', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});
const verifyToken = (req, res, next) => {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
      // Split at the space (Bearer TOKEN)
      const bearer = bearerHeader.split(' ');
      // Get token from array
      const bearerToken = bearer[1];
      // Verify token
      jwt.verify(bearerToken, 'verySecretKey123', (err, authData) => {
        if (err) {
          // Forbidden
          res.sendStatus(403);
        } else {
          // Next middleware
          req.user = authData;
          next();
        }
      });
    } else {
      // Forbidden
      res.sendStatus(403);
    }
  };
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// Register route
router.post('/account/register', upload.single('avatar'), async (req, res) => {
    try {
        let { email, username, password } = req.body;
        

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Email already exists' });
        }

        // Hash the password
        password = hashPassword(password);

        let avatarData = 'default_avatar_url'; // Default avatar URL
        if (req.file) {
            const avatarBuffer = req.file.buffer;
            avatarData = `data:${req.file.mimetype};base64,${avatarBuffer.toString('base64')}`;
        }
        

        // Create a new user with the hashed password and Base64 encoded avatar
        user = new User({ email, username, password });
        await user.save();

        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});




  router.post('/account/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        // User not found with this email
        return res.status(400).json({ msg: 'Invalid email or password.' });
      }
  
      // Hash the incoming password and compare it with the hashed password in the database
      const hashedPassword = hashPassword(password);
      console.log(hashedPassword)
      console.log(user.password)
      if (hashedPassword !== user.password) {
        // Password does not match
        return res.status(400).json({ msg: 'Invalid email or password.' });
      }
  
      // Password matches, create the JWT payload
      const payload = { id: user._id };
      // Sign the token with the same key as in the register route
      const token = jwt.sign(payload, 'verySecretKey123', { expiresIn: '1h' });
  
      // Send the token back to the client
      res.json({ token });
    } catch (err) {
      // Handle errors
      console.error('Server error during login:', err);
      res.status(500).json({ msg: 'Server error during login.' });
    }
});



// Route to update the current user's profile
// Route to update the current user's profile
// Route to update the current user's profile
router.put('/profile', verifyToken, upload.single('avatar'), async (req, res) => {
    try {
        const userId = req.user.id;
        
        const { userName, description, cardId } = req.body;
        console.log(userId)
        // Check for username uniqueness
        const existingUser = await User.findOne({ username: userName, _id: { $ne: userId } });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        let avatarData;
        if (req.file) {
            avatarData = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        } else {
            const user = await User.findById(userId);
            avatarData = user.profile.avatar;
        }

        // Update the user's username and profile
        const updatedUser = await User.findByIdAndUpdate(userId, {
            username: userName,
            'profile.avatar': avatarData,
            'profile.description': description
        }, { new: true });
        
        // If there's a cardId, update the card information as well
        if (cardId) {
            await Card.findByIdAndUpdate(cardId, {
                userName: userName,
                description: description,
                avatarImage: avatarData
            }, { new: true });
        }

        res.json({ message: 'Profile and card updated successfully', profile: updatedUser.profile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
});
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(user)
    // Send all user information except the password
    res.json(user); // This will include username, email, profile, createdAt, likes, and likedBy
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});





router.get('/cards', verifyToken, async (req, res) => {
    try {
        // 如果您想获取所有卡片，不管用户ID，请移除userId条件
        const cards = await Card.find({});
        res.json(cards);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
});



router.post('/card', verifyToken, upload.single('cardImage'), async (req, res) => {
    const { description, userName } = req.body;
    const userId = req.user.id; // Extracted from the verified token
    let cardImagePath = '';
  
    if (req.file) {
        cardImagePath = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    try {
        // Check if the user already has a card
        let card = await Card.findOne({ userId });
        if (card) {
            // Update existing card
            card.description = description;
            card.userName = userName; // Update the username
            if (req.file) card.backgroundImage = cardImagePath;
        } else {
            // Create a new card
            card = new Card({
                userId,
                userName, // Add the username here
                description,
                backgroundImage: cardImagePath
                // Do not add the avatar image
            });
        }
        
        await card.save();
        
        res.json({ msg: 'Card updated successfully', card });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error', error });
    }
});

router.get('/matches', verifyToken, async (req, res) => {
    try {
        // Assuming 'likes' is an array of user IDs that the logged-in user has liked
        // and 'likedBy' is an array of user IDs of users who have liked the logged-in user
        const user = await User.findById(req.user.id);
        const matches = user.likes.filter(userId => user.likedBy.includes(userId));

        // Populate match details if needed
        const matchDetails = await User.find({ '_id': { $in: matches } }).select('-password');
        res.json(matchDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
});


router.post('/card/like', verifyToken, async (req, res) => {
    const { likedUserId } = req.body;

    try {
        const currentUser = await User.findById(req.user.id);
        const likedUser = await User.findById(likedUserId);

        if (!likedUser) {
            return res.status(404).json({ message: 'Liked user not found' });
        }

        // Check if a chat already exists, if not, create one
        let chat = await Chat.findOne({ participants: { $all: [req.user.id, likedUserId] } });
        if (!chat) {
            chat = new Chat({ participants: [req.user.id, likedUserId], messages: [] });
            await chat.save();
        }

        // Add liked user to currentUser's likes if not already liked
        if (!currentUser.likes.includes(likedUserId)) {
            currentUser.likes.push(likedUserId);
            await currentUser.save();
        }

        res.json({ message: 'Liked successfully', chatId: chat._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
});

  

router.post('/dislike', verifyToken, async (req, res) => {
    const { dislikedUserId } = req.body;
    try {
        const currentUser = await User.findById(req.user.id);

        // Remove disliked user from currentUser's likes
        currentUser.likes = currentUser.likes.filter(userId => userId.toString() !== dislikedUserId);
        await currentUser.save();

        res.json({ message: 'Disliked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
});


// Get chat history
// Get chat messages with search and pagination
router.get('/chat/:chatId', verifyToken, async (req, res) => {
    const { chatId } = req.params;
    const { page = 1, limit = 10, searchTerm = '' } = req.query;
  
    try {
      const chat = await Chat.findById(chatId)
                             .populate('messages.sender', 'username profile.avatar');
  
      if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
      }
  
      if (!chat.participants.some(participantId => participantId.equals(req.user.id))) {
        return res.status(403).json({ message: 'User not a participant in the chat' });
      }
  
      // Filter messages that match the search term and implement pagination
      const messages = chat.messages
                           .filter(msg => msg.message.toLowerCase().includes(searchTerm.toLowerCase()))
                           .slice((page - 1) * limit, page * limit);
  
      res.json({ messages, page, totalPages: Math.ceil(chat.messages.length / limit) });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  });
  
  // Send chat message
  router.post('/chat/send', verifyToken, async (req, res) => {
    const { chatId, message } = req.body;
  
    try {
      const chat = await Chat.findById(chatId);
  
      if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
      }
  
      // Only allow participants of the chat to send messages
      if (!chat.participants.some(participantId => participantId.equals(req.user.id))) {
        return res.status(403).json({ message: 'User not a participant in the chat' });
      }
  
      const newMessage = {
        sender: req.user.id,
        message: message,
        timestamp: new Date() // Timestamp is added when the message is created
      };
  
      chat.messages.push(newMessage);
      await chat.save();
  
      res.json({ message: 'Message sent', newMessage });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  });
  


module.exports = router;

