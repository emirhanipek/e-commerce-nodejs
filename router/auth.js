const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const rateLimit = require('express-rate-limit');
const connection = require('../db/mysql');

const router = express.Router();

// Ensure JWT secrets are provided
if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  console.error('FATAL: JWT_SECRET and JWT_REFRESH_SECRET must be defined in environment variables');
  process.exit(1);
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation function
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (password.length < minLength) {
    return { valid: false, message: `Password must be at least ${minLength} characters long` };
  }
  if (!hasUpperCase || !hasLowerCase) {
    return { valid: false, message: 'Password must contain both uppercase and lowercase letters' };
  }
  if (!hasNumbers) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  if (!hasSpecialChar) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  
  return { valid: true };
};

// 🔹 Register
router.post('/register', authLimiter, async (req, res) => {
  const { email, password } = req.body;
  
  // Input validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  // Email format validation
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  
  // Password complexity validation
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return res.status(400).json({ message: passwordValidation.message });
  }

  let conn;
  try {
    conn = await connection.promise().getConnection();
    await conn.beginTransaction();
    
    const [rows] = await conn.query('SELECT id FROM users WHERE email = ?', [email]);

    if (rows.length > 0) {
      await conn.rollback();
      return res.status(409).json({ message: 'This email is already registered' });
    }

    const hash = await bcrypt.hash(password, 12); // Increased rounds for better security
    const userId = uuidv4();

    await conn.query(
      `INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)`,
      [userId, email, hash]
    );
    
    await conn.commit();
    
    // Log registration (without sensitive data)
    console.log(`New user registered: ${email} (ID: ${userId})`);
    
    res.status(201).json({ message: 'Registration successful', userId });
  } catch (err) {
    if (conn) await conn.rollback();
    console.error('Registration error:', err.message);
    res.status(500).json({ message: 'Server error' });
  } finally {
    if (conn) conn.release();
  }
});

// 🔹 Login
router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;
  
  // Input validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  // Email format validation
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  let conn;
  try {
    conn = await connection.promise().getConnection();
    await conn.beginTransaction();
    
    const [rows] = await conn.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      await conn.rollback();
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      await conn.rollback();
      // Log failed login attempt
      console.log(`Failed login attempt for email: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
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
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await conn.query(
      'UPDATE users SET refresh_token=?, last_login=NOW() WHERE id=?',
      [hashedRefreshToken, user.id]
    );
    
    await conn.commit();
    
    // Log successful login (without sensitive data)
    console.log(`User logged in: ${email} (ID: ${user.id})`);

    res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (err) {
    if (conn) await conn.rollback();
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error' });
  } finally {
    if (conn) conn.release();
  }
});

// 🔹 Refresh Token
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token required' });
  }

  let conn;
  try {
    // First verify the token structure
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    
    conn = await connection.promise().getConnection();
    const [rows] = await conn.query('SELECT * FROM users WHERE id = ?', [decoded.id]);

    if (rows.length === 0) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    
    const user = rows[0];
    
    // Verify the refresh token matches the hashed version in database
    const tokenMatch = await bcrypt.compare(refreshToken, user.refresh_token);
    if (!tokenMatch) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    res.json({ accessToken });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    console.error('Token refresh error:', err.message);
    res.status(500).json({ message: 'Server error' });
  } finally {
    if (conn) conn.release();
  }
});

// 🔹 Logout
router.post('/logout', async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  let conn;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    conn = await connection.promise().getConnection();
    await conn.query(
      'UPDATE users SET refresh_token=NULL WHERE id=?',
      [decoded.id]
    );
    
    console.log(`User logged out: ID ${decoded.id}`);
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err.message);
    res.status(500).json({ message: 'Server error' });
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;