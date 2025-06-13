// middleware/auth.js
const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config/jwt');

module.exports = (req, res, next) => {
  const token = req.cookies?.token || 
               (req.headers.authorization?.startsWith('Bearer ') 
                 ? req.headers.authorization.split(' ')[1] 
                 : null);

  if (!token) {
    return res.status(401).json({ 
      success: false,
      errors: [{ message: "Authentication required" }] 
    });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    
    // Support both userId and id in the token
    const userId = decoded.userId || decoded.id;
    
    if (!userId) {
      throw new Error("Malformed token payload - missing user ID");
    }

    // Attach user in a way that works with all your controllers
    req.user = { 
      id: userId,       // For Prisma compatibility
      userId: userId    // For your existing code
    };
    
    next();
  } catch (err) {
    return res.status(401).json({ 
      success: false,
      errors: [{ message: "Invalid or expired token" }] 
    });
  }
};