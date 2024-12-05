const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken');
const Role = require('../models/Role');

// Function to create a user (register)
async function createUser(req, res) {
    try {
      const { name, email, password, role, bio, skills, hourlyRate } = req.body;
  
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Find the role based on the role name (e.g., 'client', 'gig_worker', 'admin')
      const roleDocument = await Role.findOne({ name: role });
  
      if (!roleDocument) {
        return res.status(400).json({ message: 'Invalid role' });
      }
  
      // Create a new user with the role reference
      const newUser = new User({
        name,
        email,
        password, // Store password as plain text, bcrypt will hash it in the pre-save hook
        role: roleDocument._id,  // Reference to the role's ObjectId
        bio,
        skills,
        hourlyRate
      });
  
      // Save user and return response
      await newUser.save();
      res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error: error.message });
    }
  }
  

// Function to login a user
async function loginUser(req, res) {
    try {
      const { email, password } = req.body;
  
      // Find user by email
      const user = await User.findOne({ email }).populate('role'); 
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  

      console.log("user" , user)
      // Compare password with hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("isMatch" , password , user.password)
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  

      console.log("isMatch" , isMatch)
      // Generate a token with the user's id and role (or any other info you want to include)
      const token = generateToken(user);
  
      
      // Send token back to the client
      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role.name, // Return the role name, or other details from the Role model
          bio: user.bio,
          skills: user.skills,
          hourlyRate: user.hourlyRate,
        },
      });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Error logging in', error: error.message });
    }
  }

// Function to get user profile
async function getUserProfile(req, res) {
  try {
    const user = await User.findById(req.user._id); // Assuming user id is stored in req.user from auth middleware
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
}

// Function to update user profile
async function updateUserProfile(req, res) {
  try {
    const { name, bio, skills, hourlyRate } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, 
      { name, bio, skills, hourlyRate }, 
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile', error: error.message });
  }
}

// Function to delete user account
async function deleteUserAccount(req, res) {
  try {
    const deletedUser = await User.findByIdAndDelete(req.body.userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user account', error: error.message });
  }
}

// Function to change user password
async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    // Hash and update the new password
    user.password = await bcrypt.hash(newPassword, 8);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
}

module.exports = {
  createUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  changePassword
};
