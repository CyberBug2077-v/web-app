const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = require('../models/user');

console.log(process.env.JWT_SECRET);

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// TEMPORARY: Directly set the secret key for testing purposes only.
opts.secretOrKey = 'verySecretKey123';

passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        User.findOne({email: jwt_payload.email})
        .then(user => {
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch(err => console.log(err))
    })
)