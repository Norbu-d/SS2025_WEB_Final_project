const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

app.use(cookieParser());

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

module.exports = app;