const express = require('express');
const router = express.Router();
const { validate, handleValidationErrors } = require('../utils/validation');
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

// Register route
router.post(
  '/register',
  authLimiter,
  ...validate('register'),
  handleValidationErrors,
  authController.register
);

// Login route
router.post(
  '/login',
  authLimiter,
  ...validate('login'),
  handleValidationErrors,
  authController.login
);

module.exports = router;