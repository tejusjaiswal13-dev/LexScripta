// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import middleware
const rateLimiter = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');

// Import routes
const legalRoutes = require('./routes/legalRoutes');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE =====
// Security headers
app.use(helmet());

// CORS - Allow frontend to access
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Rate limiting
app.use('/api/', rateLimiter);

// ===== ROUTES =====

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'LexScripta API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    aiEnabled: !!(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY)
  });
});

// Legal categories
app.get('/api/categories', (req, res) => {
  res.status(200).json({
    success: true,
    categories: [
      { id: 'property', name: 'Property Law', icon: '🏠' },
      { id: 'employment', name: 'Employment Law', icon: '💼' },
      { id: 'consumer', name: 'Consumer Rights', icon: '🛒' },
      { id: 'family', name: 'Family Law', icon: '👨‍👩‍👧‍👦' },
      { id: 'criminal', name: 'Criminal Law', icon: '⚖️' },
      { id: 'business', name: 'Business Law', icon: '🏢' },
      { id: 'tax', name: 'Tax Law', icon: '💰' },
      { id: 'intellectual', name: 'IP Rights', icon: '💡' }
    ]
  });
});

// Main legal routes
app.use('/api/v1/legal', legalRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handler (must be last)
app.use(errorHandler);

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║          LexScripta API Server                 ║
║                                                ║
║  Status: Running                               ║
║  Port: ${PORT}                                    ║
║  Environment: ${process.env.NODE_ENV || 'development'}                      ║
║  AI Mode: ${!!(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY) ? 'Real AI Enabled' : 'Mock Mode'}                ║
║                                                ║
╚════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});