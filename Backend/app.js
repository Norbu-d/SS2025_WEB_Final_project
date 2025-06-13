// app.js
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// 🔓 Enable CORS for frontend connection
app.use(cors({
  origin: 'http://localhost:5173', //  frontend origin
  credentials: true // Allow cookies (for auth)
}));

// 🧠 Middleware
app.use(express.json());          // Parse JSON request bodies
app.use(cookieParser());         // Parse cookies

// 📂 Serve static files (e.g., uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🚏 Routes - UPDATED MOUNTING POINTS
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes')); 
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/likes', require('./routes/likeRoutes')); 
app.use('/api', require('./routes/commentRoutes'));
app.use('/api', require('./routes/followRoutes'));

// ❤️ Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// ❌ Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;