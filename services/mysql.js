// services/mysql.js
const mysql = require('mysql2');
require('dotenv').config();

// Bağlantı havuzu (pool) oluştur
const pool = mysql.createPool({
  host: process.env.DB_HOST,     
  user: process.env.DB_USER,     
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,  // Aynı anda 10 bağlantı kullanılabilir
  queueLimit: 0         // Sıra limiti yok
});

// Bağlantıyı test et
pool.getConnection((err, connection) => {
  if (err) {
    console.error('MySQL bağlantı hatası:', err);
  } else {
    console.log('MySQL bağlantısı başarılı ✅');
    connection.release(); // test sonrası bağlantıyı serbest bırak
  }
});

module.exports = pool;
