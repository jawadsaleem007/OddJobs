const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // If token is invalid or expired, return a 400 status with an error message
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = userAuth;
