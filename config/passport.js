/* eslint-disable @typescript-eslint/naming-convention */

const JwtStrategy = require('passport-jwt').Strategy; // authentication middleware for Node.js
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('../config/keys');
// const passport = require('passport');
// const { errorMonitor } = require('node:stream'); // instead of stream

const opts = {};
// Specify how the JWT is extracted from the incoming request.
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// Provide the secret key for decoding and verifying the JWT.
opts.secretOrKey = keys.secretOrKey;

// Export a function that configures Passport to use the JwtStrategy instance.
module.exports = (passport) => {
  // Configure and set up authentication strategies within Passport
  passport.use(
    // Set up and configure a specific authentication strategy within Passport
    new JwtStrategy(opts, (jwt_payload, done) => {
      // verification callback function
      User.findById(jwt_payload.id)
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((err) => console.log(err));
    }),
  );
};
