const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const connection = require('../db/mysql'); // MySQL bağlantı dosyan

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'super-refresh-key';

// 🔹 Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email ve şifre zorunlu' });

  try {
    const [rows] = await connection
      .promise()
      .query('SELECT id FROM users WHERE email = ?', [email]);

    if (rows.length > 0)
      return res.status(409).json({ message: 'Bu email zaten kayıtlı' });

    const hash = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await connection.promise().query(
      `INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)`,
      [userId, email, hash]
    );

    res.status(201).json({ message: 'Kayıt başarılı', userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// 🔹 Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email ve şifre zorunlu' });

  try {
    const [rows] = await connection
      .promise()
      .query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0)
      return res.status(401).json({ message: 'Email veya şifre hatalı' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(401).json({ message: 'Email veya şifre hatalı' });

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

    await connection.promise().query(
      'UPDATE users SET refresh_token=? WHERE id=?',
      [refreshToken, user.id]
    );

    res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// 🔹 Refresh Token (opsiyonel)
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(400).json({ message: 'Refresh token gerekli' });

  try {
    const [rows] = await connection
      .promise()
      .query('SELECT * FROM users WHERE refresh_token = ?', [refreshToken]);

    if (rows.length === 0)
      return res.status(403).json({ message: 'Geçersiz token' });

    jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Token doğrulanamadı' });

      const accessToken = jwt.sign(
        { id: user.id },
        JWT_SECRET,
        { expiresIn: '15m' }
      );
      res.json({ accessToken });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
