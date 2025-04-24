const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config/jwt');

module.exports = (req, res, next) => {
  // Get token from cookies or Authorization header
  const token = req.cookies.token || 
               req.headers.authorization?.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: "No token provided" 
    });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    
    // Make sure req.user is properly structured
    req.user = {
      id: decoded.userId // Ensure this matches your JWT payload
    };
    
    next();
  } catch (err) {
    return res.status(401).json({ 
      success: false,
      message: "Invalid token" 
    });
  }
};