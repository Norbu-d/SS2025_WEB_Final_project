const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const prisma = require('../prismaClient');
const { jwt: jwtConfig } = require('../config/jwt');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

// Password complexity requirements
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

exports.register = async (req, res) => {
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

    // Additional password validation
    if (password.length < PASSWORD_MIN_LENGTH) {
      return res.status(400).json({
        success: false,
        errors: [{
          field: 'password',
          message: 'Password must be at least 8 characters'
        }]
      });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        success: false,
        errors: [{
          field: 'password',
          message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
        }]
      });
    }

    // Check for existing user
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      return res.status(409).json({
        success: false,
        errors: [{
          field,
          message: `${field} already in use`
        }]
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        full_name
      },
      select: {
        id: true,
        username: true,
        email: true,
        full_name: true,
        created_at: true
      }
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    // Set secure HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(201).json({
      success: true,
      user,
      token // Also return token in response (for mobile clients)
    });

  } catch (error) {
    logger.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { email, password } = req.body;

    // Find user with password
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        full_name: true,
        password: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        errors: [{ message: 'Invalid credentials' }] // Don't specify field for security
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        errors: [{ message: 'Invalid credentials' }]
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    // Set secure HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Remove password before sending response
    const { password: _, ...userData } = user;

    return res.json({
      success: true,
      user: userData,
      token // Also return token in response (for mobile clients)
    });

  } catch (error) {
    logger.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        full_name: true,
        profile_picture: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.json({
      success: true,
      user
    });

  } catch (error) {
    logger.error('Token verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Token verification failed'
    });
  }
};