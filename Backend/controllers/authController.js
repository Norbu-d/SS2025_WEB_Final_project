const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const { jwt: jwtConfig } = require('../config/jwt');

exports.register = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }

  try {
    const { username, email, password, full_name } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        errors: [{
          field: 'email',
          message: 'Email already in use'
        }]
      });
    }

    // Create new user
    const user = await User.create({ username, email, password, full_name });
    
    // Generate JWT token
    const payload = { 
      user: { 
        id: user.id,
        username: user.username
      } 
    };
    
    const token = jwt.sign(payload, jwtConfig.secret, { 
      expiresIn: jwtConfig.expiresIn 
    });

    // Return success response
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific errors
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        errors: [{
          field: 'username',
          message: 'Username already taken'
        }]
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.login = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }

  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        errors: [{
          field: 'email',
          message: 'Invalid credentials'
        }]
      });
    }

    // Verify password
    const isPasswordValid = await User.verifyPassword(user.id, password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        errors: [{
          field: 'password',
          message: 'Invalid credentials'
        }]
      });
    }

    // Generate JWT token
    const payload = { 
      user: { 
        id: user.id,
        username: user.username
      } 
    };
    
    const token = jwt.sign(payload, jwtConfig.secret, { 
      expiresIn: jwtConfig.expiresIn 
    });

    // Return success response
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Add this new method for token verification
exports.verifyToken = async (req, res) => {
  try {
    // The auth middleware already verified the token
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name
      }
    });
    
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Token verification failed'
    });
  }
};