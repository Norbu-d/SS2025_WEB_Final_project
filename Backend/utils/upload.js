const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure upload directory (now separates posts from profile pictures)
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
    cb(null, `post-${uniqueSuffix}${ext}`); // Clear post-specific naming
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) return cb(null, true);
  cb(new Error('Only images (JPEG/JPG/PNG/GIF/WEBP) allowed!'), false);
};

// Key change: Now expects 'image' for posts (not 'profile_picture')
const upload = multer({ 
  storage,
  fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1 
  }
}).single('image'); // <<< Critical change for post uploads

const handleUpload = (req, res, next) => {
  upload(req, res, (err) => {
    // Handle missing file first
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Use field name "image" for posts.'
      });
    }

    // Handle errors
    if (err) {
      let message = 'Upload failed';
      if (err instanceof multer.MulterError) {
        switch (err.code) {
          case 'LIMIT_FILE_SIZE':
            message = 'Max file size is 5MB';
            break;
          case 'LIMIT_UNEXPECTED_FILE':
            message = 'Use field name "image" for post uploads';
            break;
        }
      } else if (err.message.includes('Only images')) {
        message = err.message;
      }

      // Cleanup failed upload
      if (req.file) fs.unlinkSync(req.file.path);
      
      return res.status(400).json({ 
        success: false, 
        message 
      });
    }

    // Windows path fix
    if (process.platform === 'win32') {
      req.file.path = req.file.path.replace(/\\/g, '/');
    }

    next(); // Successful upload
  });
};

module.exports = handleUpload;