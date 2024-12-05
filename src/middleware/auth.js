const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role'); // Import the Role model

const adminAuth = async (req, res, next) => {
  try {
     const token = req.header('Authorization').replace('Bearer ', '');
    
    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log("decoded" , decoded)
    // Find the user based on the decoded user ID
    const user = await User.findById(decoded._id).populate('role'); // Populate the 'role' field
    
    // If user is not found or if the user role is not 'admin'
    if (!user || user.role.name !== 'admin') {
      return res.status(401).json({ error: 'Please authenticate as admin' });
    }
    
    // Attach user information to the request object
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate as admin' });
  }
};

module.exports = { adminAuth };
