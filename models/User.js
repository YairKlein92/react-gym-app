// convention for models is singular and starting with a capital
/* eslint-disable @typescript-eslint/naming-convention */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Exporting the User. users - nanme of the MongoDB collection, UserSchema - structure of the docu within the users collection.
// module.exports = User = mongoose.model('users', UserSchema); since it
const User = mongoose.model('users', UserSchema);
module.exports = User;

/* eslint-enable @typescript-eslint/naming-convention */
