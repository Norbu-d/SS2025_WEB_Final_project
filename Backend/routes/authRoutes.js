const express = require('express');
const router = express.Router();
const { validate, validationResult } = require('../utils/validation');
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per window
  message: 'Too many requests from this IP, please try again later'
});

router.post(
  '/register',
  authLimiter,
  validate('register'),
  validationResult,
  authController.register
);

router.post(
  '/login', 
  authLimiter,
  validate('login'),
  validationResult,
  authController.login
);

router.get(
  '/verify',
  authController.verifyToken
);

module.exports = router;