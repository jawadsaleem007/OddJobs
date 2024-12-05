const express = require('express');
const router = express.Router();
const userAuth  = require('../middleware/userAuth'); // Custom user authorization middleware
const userController = require('../controllers/usersController');
const {adminAuth} =require("../middleware/auth")



// User Management Routes
router.post('/register', userController.createUser); // Registration
router.post('/login', userController.loginUser); // Login
router.get('/profile', userAuth, userController.getUserProfile); // Get user profile
router.put('/profile',  userAuth, userController.updateUserProfile); // Update user profile


router.delete('/profile', userAuth,adminAuth, userController.deleteUserAccount); // Delete user account

// // Password Management Routes
// router.put('/password/change', userAuth, userValidators.changePassword, userController.changePassword); // Change password


module.exports = router;
