const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // Added user routes
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ======================
// Security Middleware
// ======================
app.use(helmet());
app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ======================
// Request Processing
// ======================
// URL sanitization to fix %0A issues
app.use((req, res, next) => {
  req.url = req.url.replace(/\s+/g, '');
  next();
});

// Logging
app.use(morgan('dev')); // Always log in dev format for API

// Rate limiting (more strict for auth routes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
});
app.use(apiLimiter);

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ======================
// Static Files
// ======================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ======================
// Routes
// ======================
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes); // Mount user routes

// ======================
// Health Check
// ======================
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// ======================
// Error Handling
// ======================
// 404 Handler (must be after all routes)
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found`
  });
});

// Custom error handler
app.use(errorHandler);

module.exports = app;