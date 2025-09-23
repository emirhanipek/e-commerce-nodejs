const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const rateLimit = require('express-rate-limit');
const connection = require('../db/mysql');

const router = express.Router();

// Environment variables validation - no fallback secrets
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  console.error('CRITICAL: JWT_SECRET and JWT_REFRESH_SECRET environment variables must be set');
  process.exit(1);
}

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { message: 'Çok fazla deneme. 15 dakika sonra tekrar deneyin.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation (minimum 8 characters, at least one letter and one number)
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

// Input validation helper
const validateInput = (email, password) => {
  if (!email || !password) {
    return { valid: false, message: 'Email ve şifre zorunlu' };
  }
  
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Geçerli bir email adresi giriniz' };
  }
  
  if (!passwordRegex.test(password)) {
    return { valid: false, message: 'Şifre en az 8 karakter olmalı ve en az bir harf ve bir rakam içermelidir' };
  }
  
  return { valid: true };
};

// Error handling helper
const handleError = (err, res, customMessage = 'Sunucu hatası') => {
  console.error(err);
  
  // Different error handling for development vs production
  if (process.env.NODE_ENV === 'development') {
    return res.status(500).json({ 
      message: customMessage,
      error: err.message,
      stack: err.stack 
    });
  } else {
    return res.status(500).json({ message: customMessage });
  }
};

// Hash refresh token for secure storage
const hashRefreshToken = async (token) => {
  return await bcrypt.hash(token, 10);
};

// 🔹 Register
router.post('/register', authLimiter, async (req, res) => {
  const { email, password } = req.body;
  
  const validation = validateInput(email, password);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  const dbConnection = await connection.promise();
  
  try {
    // Start transaction
    await dbConnection.beginTransaction();
    
    const [rows] = await dbConnection.query('SELECT id FROM users WHERE email = ?', [email]);

    if (rows.length > 0) {
      await dbConnection.rollback();
      return res.status(409).json({ message: 'Bu email zaten kayıtlı' });
    }

    const hash = await bcrypt.hash(password, 12); // Increased salt rounds for better security
    const userId = uuidv4();

    await dbConnection.query(
      `INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)`,
      [userId, email, hash]
    );

    // Commit transaction
    await dbConnection.commit();
    
    res.status(201).json({ message: 'Kayıt başarılı', userId });
  } catch (err) {
    await dbConnection.rollback();
    handleError(err, res, 'Kayıt işlemi sırasında hata oluştu');
  }
});

// 🔹 Login
router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;
  
  const validation = validateInput(email, password);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  try {
    const [rows] = await connection
      .promise()
      .query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Email veya şifre hatalı' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Email veya şifre hatalı' });
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Hash refresh token before storing
    const hashedRefreshToken = await hashRefreshToken(refreshToken);

    await connection.promise().query(
      'UPDATE users SET refresh_token=? WHERE id=?',
      [hashedRefreshToken, user.id]
    );

    res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (err) {
    handleError(err, res, 'Giriş işlemi sırasında hata oluştu');
  }
});

// 🔹 Refresh Token
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token gerekli' });
  }

  try {
    // Verify the token first
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    
    // Get user and their stored refresh token
    const [rows] = await connection
      .promise()
      .query('SELECT * FROM users WHERE id = ?', [decoded.id]);

    if (rows.length === 0) {
      return res.status(403).json({ message: 'Geçersiz token' });
    }

    const user = rows[0];
    
    // Compare the provided refresh token with the hashed one in database
    const tokenMatch = await bcrypt.compare(refreshToken, user.refresh_token);
    
    if (!tokenMatch) {
      return res.status(403).json({ message: 'Geçersiz token' });
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    res.json({ accessToken });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token doğrulanamadı' });
    }
    handleError(err, res, 'Token yenileme sırasında hata oluştu');
  }
});

// 🔹 Logout
router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token gerekli' });
  }

  try {
    // Verify the token to get user ID
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    
    // Clear the refresh token from database
    await connection.promise().query(
      'UPDATE users SET refresh_token = NULL WHERE id = ?',
      [decoded.id]
    );

    res.json({ message: 'Başarıyla çıkış yapıldı' });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Geçersiz token' });
    }
    handleError(err, res, 'Çıkış işlemi sırasında hata oluştu');
  }
});

module.exports = router;