/**
 * @fileoverview Main server file for Catalog Mini App
 * @module server/index
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3003;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for Telegram Mini App
  crossOriginEmbedderPolicy: false
}));
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

// Serve static files from catalog-mini-app
app.use(express.static(path.join(__dirname, '../catalog-mini-app')));

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

// Serve index.html for root and any non-API routes (SPA routing)
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      error: 'API route not found'
    });
  }
  
  // Serve index.html for all other routes
  res.sendFile(path.join(__dirname, '../catalog-mini-app/index.html'));
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
  console.log(`📱 Mini App: http://localhost:${PORT}`);
  console.log('='.repeat(50) + '\n');
});

module.exports = app;