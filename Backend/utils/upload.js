const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure upload directory
const uploadDir = path.join(__dirname, '../uploads/posts');

// Create directory if missing
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    const userPrefix = req.user ? `user-${req.user.userId}-` : '';
    cb(null, `post-${userPrefix}${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg', 
    'image/png', 
    'image/gif', 
    'image/webp'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WEBP allowed!'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1 
  }
}).single('image');

const handleUpload = (req, res, next) => {
  upload(req, res, (err) => {
    // Handle errors first
    if (err) {
      let message = 'Upload failed';
      let code = 'UPLOAD_ERROR';

      if (err instanceof multer.MulterError) {
        switch (err.code) {
          case 'LIMIT_FILE_SIZE':
            code = 'FILE_SIZE_LIMIT';
            message = 'File size exceeds 5MB limit';
            break;
          case 'LIMIT_UNEXPECTED_FILE':
            code = 'INVALID_FIELD_NAME';
            message = 'Use field name "image" for post uploads';
            break;
          case 'LIMIT_FILE_COUNT':
            code = 'TOO_MANY_FILES';
            message = 'Only one file allowed per upload';
            break;
        }
      } else if (err.message.includes('Invalid file type')) {
        code = 'INVALID_FILE_TYPE';
        message = err.message;
      }

      // Cleanup failed upload if file exists
      if (req.file?.path && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (cleanupErr) {
          console.error('File cleanup failed:', cleanupErr);
        }
      }
      
      return res.status(400).json({ 
        success: false, 
        error: {
          code,
          message,
          details: {
            allowed_types: ['JPEG', 'PNG', 'GIF', 'WEBP'],
            max_size: '5MB',
            field_name: 'image'
          }
        }
      });
    }

    // File is optional - proceed even if no file uploaded
    // The controller will handle validation for required content
    if (req.file) {
      // Normalize path for cross-platform compatibility
      req.file.path = req.file.path.replace(/\\/g, '/');
      
      // Add additional file info
      req.file.url = `/uploads/posts/${req.file.filename}`;
    }

    next(); // Proceed to next middleware
  });
};

module.exports = handleUpload;