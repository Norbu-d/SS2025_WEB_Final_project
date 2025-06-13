// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { validate, handleValidationErrors } = require('../utils/validation');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const handleUpload = require('../utils/upload');

// Search usernames - CORRECT PATH
router.get('/search-usernames', userController.searchUsernames);

// GET User by ID - CORRECT PATH
router.get('/:id', 
  authMiddleware, 
  userController.getUserById
);

router.get('/profile/:userId', authMiddleware, userController.getUserProfile);


// UPDATE Profile
router.put(
  '/profile',
  authMiddleware,
  ...validate('updateProfile'),
  handleValidationErrors,
  userController.updateProfile
);

// UPDATE Profile Picture
router.put(
  '/profile/picture',
  authMiddleware,
  handleUpload,
  userController.updateProfilePicture
);

// List all users
router.get('/', userController.listAllUsers);

// CHANGE Password
router.put(
  '/password',
  authMiddleware,
  ...validate('changePassword'),
  handleValidationErrors,
  userController.changePassword
);

module.exports = router;