const express = require('express');
const router = express.Router();
const { validate, validationResult } = require('../utils/validation');
const authController = require('../controllers/authController');

router.post(
  '/register',
  validate('register'),
  validationResult,
  authController.register
);

router.post(
  '/login', 
  validate('login'),
  validationResult,
  authController.login
);

module.exports = router;