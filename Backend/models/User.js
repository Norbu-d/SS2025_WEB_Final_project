const express = require('express');
const router = express.Router();
const { validate, validationResult } = require('../utils/validation');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const upload = require('../utils/upload');

// GET User by ID
router.get(
  '/users/:id',
  authMiddleware,
  userController.getUserById
);

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
  upload.single('profile_picture'),
  userController.updateProfilePicture
);

// CHANGE Password
router.put(
  '/password',
  authMiddleware,
  validate('changePassword'),
  validationResult,
  userController.changePassword
);

module.exports = router;