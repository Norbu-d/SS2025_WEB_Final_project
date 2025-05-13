
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../prismaClient');
const { jwt: jwtConfig } = require('../config/jwt');
const logger = require('../utils/logger');

const register = async (req, res) => {
  try {
    const { username, email, password, full_name, birth_month, birth_day, birth_year } = req.body;

    // Validate birthday fields if provided
    if (birth_month || birth_day || birth_year) {
      if (!birth_month || !birth_day || !birth_year) {
        return res.status(400).json({
          success: false,
          errors: [{
            field: 'birthday',
            message: 'All birthday fields (month, day, year) must be provided together'
          }]
        });
      }

      // Basic validation
      if (birth_month < 1 || birth_month > 12) {
        return res.status(400).json({
          success: false,
          errors: [{
            field: 'birth_month',
            message: 'Month must be between 1 and 12'
          }]
        });
      }

      if (birth_day < 1 || birth_day > 31) {
        return res.status(400).json({
          success: false,
          errors: [{
            field: 'birth_day',
            message: 'Day must be between 1 and 31'
          }]
        });
      }

      const currentYear = new Date().getFullYear();
      if (birth_year < 1900 || birth_year > currentYear) {
        return res.status(400).json({
          success: false,
          errors: [{
            field: 'birth_year',
            message: `Year must be between 1900 and ${currentYear}`
          }]
        });
      }
    }

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

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        full_name,
        birth_month: birth_month || null,
        birth_day: birth_day || null,
        birth_year: birth_year || null
      },
      select: {
        id: true,
        username: true,
        email: true,
        full_name: true,
        birth_month: true,
        birth_day: true,
        birth_year: true,
        created_at: true
      }
    });

    const token = jwt.sign({ userId: user.id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(201).json({
      success: true,
      user,
      token
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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

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

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        errors: [{ message: 'Invalid credentials' }]
      });
    }

    const token = jwt.sign({ userId: user.id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    const { password: _, ...userData } = user;

    return res.json({
      success: true,
      user: userData,
      token
    });

  } catch (error) {
    logger.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const verifyToken = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
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
      message: 'Token verification failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  register,
  login,
  verifyToken
};