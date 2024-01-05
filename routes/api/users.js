const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
/* eslint-disable @typescript-eslint/naming-convention */

const validateRegisterInput = require('../../validation/register');
// Load User Module
const User = require('../../models/User');
const { request } = require('node:http');

router.get('/test', (req, res) => res.json({ msg: 'Users works' })); // the servers.js contains the routes/api/ already

// @route GET api/users/register
// @desc Register user
// @access Public

router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors); // not valid, there is error
  }
  User.findOne({ email: req.body.email }) // findOne mongoose method

    .then((user) => {
      if (user) {
        return res.status(400).json({ email: 'Email already exists' });
      } else {
        // Check documentation gravatar
        const avatar = gravatar.url(req.body.email, {
          s: '200', // Size
          r: 'pg', // Rating
          d: 'mm', // Default
        });
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar, // equal to avatar: avatar,
          password: req.body.password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt
            .hash(newUser.password, salt, (error, hash) => {
              if (error) throw error;
              newUser.password = hash;
              newUser
                .save()
                .then((theUser) => res.json(theUser))
                .catch((e) => console.log(e));
            }) // plain text
            .catch((errorMsg) => console.log(errorMsg));
        });
      }
    })
    .catch((error) => console.log(error));
});

// @route GET api/users/login
// @desc Login user  / Returning JWS token
// @access Public

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // find user by email
  User.findOne({ email })
    .then((user) => {
      // Check for user
      if (!user) {
        return res.status(404).json({ email: 'User not found' });
      }

      // Check password
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          // User matched
          // res.json({ msg: 'Success' });
          // Create JWT payload
          const payload = { id: user.id, name: user.name, avatar: user.avatar };
          // Sign Token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 7200 },
            (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token,
              });
            },
          );
        } else {
          return res.status(400).json({ password: 'Password incorrect' });
        }
      });
    })
    .catch((e) => console.log(e));
});

// @route GET api/users/current
// @desc Return current user
// @access Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      // Create own res instead od req.user which contains the passport
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  },
);

module.exports = router; // so that server.js can pick it up
