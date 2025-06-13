const express = require('express');
const router = express.Router();
const { validate, handleValidationErrors } = require('../utils/validation');
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');
const authMiddleware = require('../middleware/auth'); // Direct import

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many requests from this IP, please try again later'
});

// Verify route
router.get(
  '/verify',
  authMiddleware, // Use the middleware directly (no .verifyToken)
  authController.verifyToken
);

// Register route
router.post(
  '/register',
  authLimiter,
  ...validate('register'),
  handleValidationErrors,
  authController.register
);

router.get('/check', authController.checkAuth);

// Login route
router.post(
  '/login',
  authLimiter,
  ...validate('login'),
  handleValidationErrors,
  authController.login
);

router.post(
  '/logout',
  authMiddleware, // Optional middleware
  authController.logout // Should now be defined
);

module.exports = router;