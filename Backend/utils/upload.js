const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure upload directory
const uploadDir = path.join(__dirname, '../uploads');

// Create uploads directory if it doesn't exist
const ensureUploadsDirExists = () => {
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('Uploads directory created');
    }
  } catch (err) {
    console.error('Error creating uploads directory:', err);
    throw new Error('Failed to initialize upload directory');
  }
};

// Initialize directory on startup
ensureUploadsDirExists();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    const originalName = path.basename(file.originalname, ext)
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
    cb(null, `${originalName}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  if (mimetype && extname) {
    return cb(null, true);
  }
  
  cb(new Error(`Invalid file type. Only ${allowedTypes} are allowed!`), false);
};

const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB
  files: 1 // Limit to single file uploads
};

const upload = multer({
  storage,
  fileFilter,
  limits
}).single('image');

// Custom error handler (replaces the need for external error utility)
const createUploadError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

// Custom middleware to handle uploads and errors
const handleUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        // Handle specific Multer errors
        switch (err.code) {
          case 'LIMIT_FILE_SIZE':
            return next(createUploadError(413, 'File too large. Maximum 5MB allowed'));
          case 'LIMIT_FILE_COUNT':
            return next(createUploadError(400, 'Too many files. Only one file allowed'));
          case 'LIMIT_UNEXPECTED_FILE':
            return next(createUploadError(400, 'Unexpected file field'));
          default:
            return next(createUploadError(400, err.message));
        }
      } else if (err) {
        // Handle other errors
        return next(createUploadError(500, 'File upload failed'));
      }
    }
    
    // If no file was uploaded (and it's required)
    if (!req.file) {
      return next(createUploadError(400, 'No file uploaded'));
    }
    
    // Add file path to request for easier access in controllers
    req.file.path = req.file.path.replace(/\\/g, '/'); // Convert Windows paths
    next();
  });
};

module.exports = handleUpload;