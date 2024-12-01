const express = require('express');
const { 
  registerUser, 
  loginUser, 
  registerDriver, 
  loginDriver 
} = require('../controllers/authController');  // Import the necessary functions from the controller
const { authenticateToken } = require('../middleware/authMiddleware');  // Import the authentication middleware
const { uploadFiles } = require('../controllers/authController');



const router = express.Router();

// Public Routes for Users
router.post('/register-user', registerUser);  // User registration
router.post('/login-user', loginUser);  // User login

// Public Routes for Drivers
router.post('/register-driver', uploadFiles, registerDriver);
router.post('/login-driver', loginDriver);  // Driver login

// Protected Route (Example)
router.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Welcome to your profile', user: req.user });
});

module.exports = router;
