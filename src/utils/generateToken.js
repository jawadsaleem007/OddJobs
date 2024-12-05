const jwt = require('jsonwebtoken');
require('dotenv').config();

// Generate JWT Token function
const generateToken = (user) => {
  const payload = {
    _id: user._id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
};

module.exports = generateToken;