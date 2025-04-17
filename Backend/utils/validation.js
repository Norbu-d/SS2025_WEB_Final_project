const { check, validationResult } = require('express-validator');
const User = require('../models/User');

exports.validate = (method) => {
  switch (method) {
    case 'register':
      return [
        check('username')
          .notEmpty().withMessage('Username is required')
          .isLength({ min: 3 }).withMessage('Must be at least 3 characters')
          .custom(async username => {
            const user = await User.findByUsername(username);
            if (user) throw new Error('Username already in use');
          }),
        check('email')
          .isEmail().withMessage('Invalid email')
          .custom(async email => {
            const user = await User.findByEmail(email);
            if (user) throw new Error('Email already in use');
          }),
        check('password')
          .isLength({ min: 6 }).withMessage('Must be at least 6 characters'),
        check('full_name')
          .notEmpty().withMessage('Full name is required')
      ];

    case 'login':
      return [
        check('email').isEmail().withMessage('Invalid email'),
        check('password').notEmpty().withMessage('Password required')
      ];

    default:
      return [];
  }
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