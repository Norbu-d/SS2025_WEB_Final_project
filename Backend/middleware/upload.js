const { createUploader } = require('./uploadMiddleware'); // Correct import

// Post upload config
exports.postUpload = createUploader({
  directory: 'uploads/posts',
  filePrefix: 'post',
  allowedMimes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fieldName: 'image'
});

// Profile picture config
exports.profileUpload = createUploader({
  directory: 'uploads/profile',
  filePrefix: 'avatar',
  allowedMimes: ['image/jpeg', 'image/png', 'image/webp'],
  limits: { 
    fileSize: 2 * 1024 * 1024 // 2MB
  },
  fieldName: 'avatar'
});