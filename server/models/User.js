// server/models/User.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// This is the blueprint for a 'User' in our database
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // No two users can have the same email
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'faculty'], // Role must be one of these two values
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // Automatically sets the date when a user is created
  },
});

// This creates the model and exports it
// MongoDB will automatically create a collection called 'users'
module.exports = mongoose.model('User', UserSchema);