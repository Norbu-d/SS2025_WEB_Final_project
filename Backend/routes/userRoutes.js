const express = require('express');
const router = express.Router();
const { validate, validationResult } = require('../utils/validation');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const upload = require('../utils/upload');
const rateLimit = require('express-rate-limit');

// Rate limiting for sensitive operations
const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: 'Too many attempts, please try again later'
});

// GET User by ID
router.get(
  '/users/:id',
  authMiddleware,
  userController.validateUserId,
  userController.getUserById
);

// UPDATE Profile
router.put(
  '/profile',
  authMiddleware,
  validate('updateProfile'),
  validationResult,
  userController.updateProfile
);

// UPDATE Profile Picture
router.put(
  '/profile/picture',
  authMiddleware,
  upload, // Using our improved upload middleware
  userController.updateProfilePicture
);

// CHANGE Password
router.put(
  '/password',
  authMiddleware,
  sensitiveLimiter,
  validate('changePassword'),
  validationResult,
  userController.changePassword
);

module.exports = router;