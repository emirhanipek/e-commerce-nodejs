const express = require('express');
const cors = require('cors');
const app = express();
const productRouter = require('./router/product');
const categoryRouter = require('./router/category');
const authRoutes = require('./router/auth');
const connection = require('./db/mysql');

const port = process.env.PORT || 3000;

// CORS configuration with specific allowed origins
const corsOptions = {
  origin: function (origin, callback) {
    // Define allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173', // Vite default port
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:5173'
    ];
    
    // Add production origins from environment variable
    if (process.env.ALLOWED_ORIGINS) {
      const envOrigins = process.env.ALLOWED_ORIGINS.split(',');
      allowedOrigins.push(...envOrigins);
    }
    
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation: Origin not allowed'));
    }
  },
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Routes
app.use('/products', productRouter);
app.use('/category', categoryRouter);
app.use('/auth', authRoutes); // Changed from '/login' to '/auth' for better REST convention
app.use('/uploads', express.static('uploads'));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.message === 'CORS policy violation: Origin not allowed') {
    return res.status(403).json({ message: 'CORS policy violation' });
  }
  
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Server başlatma
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Test veya başka modüllerde kullanılacaksa
module.exports = app;