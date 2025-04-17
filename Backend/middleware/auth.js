const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config/jwt');

module.exports = (req, res, next) => {
  // Check multiple token sources
  const token = req.header('x-auth-token') || 
                req.headers.authorization?.split(' ')[1] ||
                req.cookies?.token; // If using cookies

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      details: 'No token found in headers or cookies',
      solution: 'Include Authorization: Bearer <token> header'
    });
  }

  try {
    // Verify token and attach user
    const decoded = jwt.verify(token, jwtConfig.secret, {
      algorithms: ['HS256'], // Specify allowed algorithm
      ignoreExpiration: false // Explicitly check expiration
    });
    
    req.user = {
      id: decoded.user.id,
      username: decoded.user.username,
      role: decoded.user.role || 'user' // Default role if not specified
    };
    
    next();
  } catch (err) {
    let errorMessage = 'Invalid token';
    let statusCode = 401;

    if (err.name === 'TokenExpiredError') {
      errorMessage = 'Token expired';
      statusCode = 403; // Forbidden
    } else if (err.name === 'JsonWebTokenError') {
      errorMessage = 'Malformed token';
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};