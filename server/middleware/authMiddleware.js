// server/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // 1. Get the token from the request header
  // We'll send it in a header named 'x-auth-token'
  const token = req.header('x-auth-token');

  // 2. Check if no token exists
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // 3. If token exists, verify it
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Add the user from the token's payload to the request object
    // This makes req.user available in all our protected routes
    req.user = decoded.user;

    // 5. Call 'next()' to move on to the next function (the controller)
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

module.exports = authMiddleware;