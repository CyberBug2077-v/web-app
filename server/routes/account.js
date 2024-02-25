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



mongoose.connect('mongodb://localhost:27017/projectdb', { useNewUrlParser: true, useUnifiedTopology: true });

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads/') // Ensure the file exists
    },
    filename: function(req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('avatar');

// Register route
router.post('/account/register',

    [
        body('email').isEmail(),
        body('password').isStrongPassword({
            minLength: 8, 
            minLowercase: 1, 
            minUppercase: 1, 
            minNumbers: 1, 
            minSymbols: 1
        })
    ],

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Send code 400 if password is not strong enough
            return res.status(400).json({ errors: errors.array() });
        }

        const avatarPath = req.file ? req.file.path : 'default_avatar_url';

        const { email, username, password } = req.body;
        const profile = req.body.profile ? JSON.parse(req.body.profile) : {};
        profile.avatar = avatarPath;
        

        try {
            // Check if email already existed
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ errors: [{ msg: 'Email already exists' }] });
            }

            user = new User({
                email,
                username,
                password,
                profile
            });

            await user.save();

            res.status(201).json({ msg: 'User registered successfully' });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }

});

// Login route
router.post('/account/login',  async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user existed
        const user = await User.findOne({ email: email });
        if (!user) {
          return res.status(400).send('Invalid email or password.');
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
          return res.status(400).send('Invalid email or password.');
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (err) {
        res.status(500).send('Server error during login.');
    }
  
});

router.get('/account/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/account/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),

    function(req, res) {
        res.redirect('/');
      }
);

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findById(req.user.id)
    .then(user => {
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.profile);
    })
    .catch(err => res.status(500).json({ message: 'Server error', error: err }));
  });

router.post('/profile/update', passport.authenticate('jwt', { session: false}), async (req, res) => {
    const { name, avatar, description } = req.body;

    try {
        // Find and update user profile
        const updatedUser = await User.findByIdAndUpdate(req.user.id, 
            { $set: { "profile.name": name, "profile.avatar": avatar, "profile.description": description }},
            { new: true } // return updated profile
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Profile updated successfully', profile: updatedUser.profile });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err });
    }

});

router.get('/card', passport.authenticate('jwt', { session: false }), (req, res) => {
    Card.findOne({ userId: req.user.id })
    .populate('userId', 'profile.name') // Get name related to the card
    .then(card => {
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }
        res.json(card);
    })
    .catch(err => res.status(500).json({ message: 'Server error', error: err }));
});

router.post('/card', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { backgroundImage, description } = req.body;
    Card.findOneAndUpdate(
        { userId: req.user.id },
        { $set: { backgroundImage, description }},
        { new: true } // Return updated card
    )
    .then(card => {
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }
        res.json(card);
    })
    .catch(err => res.status(500).json({ message: 'Server error', error: err }));
});

router.post('/card/like', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { likedUserId, like } = req.body;

    try {
        const currentUser = await User.findById(req.user.id);
        const likedUser = await User.findById(likedUserId);

        if (!likedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (like) {
            // Add to user's likes list
            if (!currentUser.likes.includes(likedUserId)) {
                currentUser.likes.push(likedUserId);
                await currentUser.save();
            }
            // Add to user's likedby list
            if (!likedUser.likedBy.includes(req.user.id)) {
                likedUser.likedBy.push(req.user.id);
                await likedUser.save();
            }
        } else {
            currentUser.likes = currentUser.likes.filter(id => id.toString() !== likedUserId);
            await currentUser.save();

            likedUser.likedBy = likedUser.likedBy.filter(id => id.toString() !== req.user.id);
            await likedUser.save();
        }

        res.status(200).json({ message: like ? 'Liked successfully' : 'Like removed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/chat/send', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { chatId, message } = req.body;

    Chat.findById(chatId)
    .then(chat => {
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        // Check if user is a participant
        if (!chat.participants.some(participant => participant.equals(req.user.id))) {
            return res.status(403).json({ message: 'User not a participant in the chat' });
        }

        const newMessage = {
            sender: req.user.id,
            message: messageText,
            timestamp: new Date()
        };

        // Add message to history
        chat.messages.push(newMessage);

        // Save updated chat history
        chat.save()
        .then(updatedChat => res.json(updatedChat))
        .catch(err => res.status(500).json({ message: 'Error saving message', error: err }));
    })
    .catch(err => res.status(500).json({ message: 'Error finding chat', error: err }));
});



module.exports = router;

