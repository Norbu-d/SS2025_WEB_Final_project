const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createUploader = (options = {}) => {
  const {
    directory = 'uploads/posts',
    filePrefix = 'post',
    allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxFileSize = 5 * 1024 * 1024, // 5MB
    fieldName = 'image'
  } = options;

  // Create absolute directory path
  const baseDir = path.resolve(__dirname, '../uploads');
  const uploadDir = path.resolve(baseDir, directory);

  // Ensure directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const uniqueIdentifier = req.user ? `user-${req.user.userId}-` : '';
      cb(null, `${filePrefix}-${uniqueIdentifier}${Date.now()}${ext}`);
    }
  });

  const fileFilter = (req, file, cb) => {
    allowedMimes.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error(`Invalid file type. Allowed: ${allowedMimes.join(', ')}`), false);
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: { 
      fileSize: maxFileSize,
      files: 1 
    }
  }).single(fieldName);

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        if (req.file?.path) fs.unlinkSync(req.file.path);
        
        const errorType = err instanceof multer.MulterError ? 'MULTER_ERROR' : 'VALIDATION_ERROR';
        return res.status(400).json({
          success: false,
          error: {
            type: errorType,
            code: err.code || 'UPLOAD_ERROR',
            message: err.message,
            details: {
              allowed_types: allowedMimes.map(m => m.split('/')[1]),
              max_size: `${maxFileSize / 1024 / 1024}MB`
            }
          }
        });
      }

      if (req.file) {
        // Normalize paths
        req.file.path = req.file.path.replace(/\\/g, '/');
        
        // Generate public URL
        const relativePath = path.relative(
          path.join(__dirname, '../uploads'),
          req.file.path
        ).replace(/\\/g, '/');
        
        req.file.url = `/${relativePath}`;
        req.file.absoluteUrl = `${req.protocol}://${req.get('host')}/${relativePath}`;
      }

      next();
    });
  };
};

module.exports = { createUploader };