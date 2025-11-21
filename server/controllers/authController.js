// server/controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- (REGISTER FUNCTION: Updated to use process.env) ---
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    user = new User({ name, email, password, role });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: { id: user.id, role: user.role },
    };

    // Use the secret from .env file
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // <-- UPDATED
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// --- (NEW LOGIN FUNCTION) ---
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 2. Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 3. User is valid, create and send token
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Use the same secret
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // Send the token
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};