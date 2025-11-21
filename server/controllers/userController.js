// server/controllers/userController.js

const User = require('../models/User');

// @desc    Get logged-in user's profile
exports.getUserProfile = async (req, res) => {
  try {
    // 1. Get the user from the database
    // req.user.id was added by our authMiddleware
    const user = await User.findById(req.user.id).select('-password');

    // 2. Check if user exists
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // 3. Send the user data (without the password)
    res.json(user);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};