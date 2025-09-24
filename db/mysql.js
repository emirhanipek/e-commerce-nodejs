// services/mysql.js
const mysql = require('mysql2');
require('dotenv').config();

// Bağlantı oluştur
const connection = mysql.createConnection({
  host: process.env.DB_HOST,     
  user: process.env.DB_USER,     
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT        // Bağlanmak istediğin veritabanı
});

// Bağlantıyı test et
connection.connect((err) => {
  if (err) {
    console.error('MySQL bağlantı hatası:', err);
  } else {
    console.log('MySQL bağlantısı başarılı ✅');
  }
});

module.exports = connection;
