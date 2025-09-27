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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('Product tablosu oluşturuldu ✅');

    // Product images tablosu
    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS product_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        image_url VARCHAR(2048) NOT NULL,
        filename VARCHAR(255),
        is_primary TINYINT(1) DEFAULT 0,
        position INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('Product_images tablosu oluşturuldu ✅');
    
    await connection.promise().query(`
  CREATE TABLE IF NOT EXISTS about (
    id INT AUTO_INCREMENT PRIMARY KEY,
    headerImage VARCHAR(255) NOT NULL,
    headerText VARCHAR(255) NOT NULL,
    headerDescription TEXT NOT NULL,
    storyTitle VARCHAR(255) NOT NULL,
    storyImage VARCHAR(255) NOT NULL,
    misyonTitle VARCHAR(255) NOT NULL,
    misyonDescription TEXT NOT NULL,
    visyonTitle VARCHAR(255) NOT NULL,
    vizyonDescription TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`);
console.log('About tablosu oluşturuldu ✅');

await connection.promise().query(`
  CREATE TABLE IF NOT EXISTS contact (
    id INT AUTO_INCREMENT PRIMARY KEY,
    headerImage VARCHAR(255) NOT NULL,
    headerTitle VARCHAR(255) NOT NULL,
    headerDesc TEXT NOT NULL,
    phoneTitle VARCHAR(255) NOT NULL,
    phoneValue VARCHAR(255) NOT NULL,
    emailTitle VARCHAR(255) NOT NULL,
    emailValue VARCHAR(255) NOT NULL,
    addressTitle VARCHAR(255) NOT NULL,
    addressValue VARCHAR(255) NOT NULL,
    workhoursTitle VARCHAR(255) NOT NULL,
    workHoursDesc TEXT NOT NULL,
    facebookLink VARCHAR(255) DEFAULT NULL,
    instaLink VARCHAR(255) DEFAULT NULL,
    linkedinLink VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`);
console.log('Contact tablosu oluşturuldu ✅');

await connection.promise().query(`
  CREATE TABLE IF NOT EXISTS light_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lightOnDesc  TEXT NOT NULL,
    lightOnPrice DECIMAL(10,2) NOT NULL,
    lightOffDesc TEXT NOT NULL,
    lightOffPrice DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`);
console.log('light_settings tablosu oluşturuldu ✅');

await connection.promise().query(`
  CREATE TABLE IF NOT EXISTS letter_materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    light_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (light_id) REFERENCES light_settings(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`);
console.log('letter_materials tablosu oluşturuldu ✅');
await connection.promise().query(`
  CREATE TABLE IF NOT EXISTS letter_heights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    light_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (light_id) REFERENCES light_settings(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`);
console.log('letter_heights tablosu oluşturuldu ✅');
await connection.promise().query(`
  CREATE TABLE IF NOT EXISTS backgrounds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    light_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (light_id) REFERENCES light_settings(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`);
console.log('backgrounds tablosu oluşturuldu ✅');


    console.log('Tüm tablolar başarıyla oluşturuldu 🎉');
    process.exit(0);
  } catch (err) {
    console.error('Tablo oluşturma hatası ❌', err);
    process.exit(1);
  }
};

createTables();
