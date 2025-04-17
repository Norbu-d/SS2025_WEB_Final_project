module.exports = (err, req, res, next) => {
  console.error('\x1b[31m', '[ERROR]', err.stack, '\x1b[0m'); // Colored logs

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: Object.values(err.errors).map(e => ({
        param: e.path,
        message: e.message,
        type: e.kind
      }))
    });
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  // Database Errors
  if (err.code === 11000) { // MongoDB duplicate key
    return res.status(409).json({
      success: false,
      message: 'Duplicate key error',
      field: Object.keys(err.keyPattern)[0]
    });
  }

  // Custom Error Structure
  if (err.isOperational) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message
    });
  }

  // Generic Error (don't leak details in production)
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && {
      error: err.message,
      stack: err.stack
    })
  });
};