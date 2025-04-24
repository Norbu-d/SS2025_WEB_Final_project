const express = require('express');
const router = express.Router();
const { validate, handleValidationErrors } = require('../utils/validation');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const handleUpload = require('../utils/upload');

// GET User by ID
router.get('/users/:id', 
  authMiddleware, 
  userController.getUserById
);

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

// CHANGE Password
router.put(
  '/password',
  authMiddleware,
  ...validate('changePassword'),
  handleValidationErrors,
  userController.changePassword
);

module.exports = router;