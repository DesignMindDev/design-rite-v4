const express = require('express'); 
const cors = require('cors'); 
const helmet = require('helmet'); 
const compression = require('compression'); 
const rateLimit = require('express-rate-limit'); 
require('dotenv').config(); 
 
const app = express(); 
const PORT = process.env.PORT || 8000; 
 
// Security middleware 
app.use(helmet()); 
app.use(compression()); 
 
// CORS configuration 
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', 
  credentials: true 
})); 
 
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' })); 
 
// Health check endpoint 
app.get('/health', (req, res) => { 
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(), 
    uptime: process.uptime() 
  }); 
}); 
 
const server = app.listen(PORT, '0.0.0.0', () => { 
  console.log(`Backend running on port ${PORT}`); 
}); 
