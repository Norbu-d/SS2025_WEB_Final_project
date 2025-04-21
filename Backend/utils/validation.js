const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const validations = {
  register: [
    body('username')
      .trim()
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 3 }).withMessage('Must be at least 3 characters')
      .custom(async (username) => {
        const user = await User.findByUsername(username);
        if (user) throw new Error('Username already in use');
        return true;
      }),
    body('email')
      .trim()
      .normalizeEmail()
      .isEmail().withMessage('Invalid email')
      .custom(async (email) => {
        const user = await User.findByEmail(email);
        if (user) throw new Error('Email already in use');
        return true;
      }),
    body('password')
      .isLength({ min: 6 }).withMessage('Must be at least 6 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('full_name')
      .trim()
      .notEmpty().withMessage('Full name is required')
  ],

  login: [
    body('email')
      .trim()
      .normalizeEmail()
      .isEmail().withMessage('Invalid email'),
    body('password')
      .notEmpty().withMessage('Password is required')
  ],

  updateProfile: [
    body('full_name')
      .optional()
      .trim()
      .notEmpty().withMessage('Full name cannot be empty'),
    body('bio')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('Bio must be less than 500 characters'),
    body('website')
      .optional()
      .trim()
      .isURL().withMessage('Invalid website URL')
      .matches(/^https?:\/\//).withMessage('Website must start with http:// or https://')
  ],

  changePassword: [
    body('currentPassword')
      .notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 }).withMessage('Must be at least 6 characters')
      .not().equals(body('currentPassword')).withMessage('New password must be different from current password')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
  ]
};

exports.validate = (validationName) => {
  return validations[validationName] || [];
};

exports.validationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array().map(err => ({
        param: err.param,
        message: err.msg
      }))
    });
  }
  next();
};