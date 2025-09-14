// services/mysql.js
const mysql = require('mysql2');

// Bağlantı oluştur
const connection = mysql.createConnection({
  host: 'localhost',       // Docker kullanıyorsan host: 'localhost' veya '127.0.0.1'
  user: 'root',            // MySQL kullanıcı adı
  password: '123456',      // MySQL şifresi
  database: 'mydb'         // Bağlanmak istediğin veritabanı
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
