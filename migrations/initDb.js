const connection = require('../services/mysql');

const createTables = async () => {
  try {
    // Category tablosu
    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS category (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Category tablosu oluşturuldu ✅');

    // Product tablosu
    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS product (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE SET NULL
      )
    `);
    console.log('Product tablosu oluşturuldu ✅');

    console.log('Tüm tablolar başarıyla oluşturuldu 🎉');
    process.exit(0);
  } catch (err) {
    console.error('Tablo oluşturma hatası ❌', err);
    process.exit(1);
  }
};

createTables();
