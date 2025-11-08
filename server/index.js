/**
 * @fileoverview Main server file for Catalog Mini App
 * @module server/index
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3003;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'catalog-app',
    port: PORT
  });
});

// API Routes
app.use('/api/courses', require('./api/courses'));
app.use('/api/categories', require('./api/categories'));
app.use('/api/analytics', require('./api/analytics'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Catalog Mini App API',
    version: '1.0.0',
    endpoints: {
      courses: '/api/courses',
      categories: '/api/categories',
      analytics: '/api/analytics',
      health: '/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 Catalog Mini App Server Started');
  console.log('='.repeat(50));
  console.log(`📍 Port: ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API Base: http://localhost:${PORT}/api`);
  console.log('='.repeat(50) + '\n');
});

module.exports = app;