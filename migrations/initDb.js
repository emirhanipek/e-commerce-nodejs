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
    await connection.promise().query(`
  CREATE TABLE IF NOT EXISTS brands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand_name VARCHAR(255) NOT NULL,
    brand_image VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`);
console.log('Brands table created ✅');

    // Örnek veriler - Brands
    await connection.promise().query(`
      INSERT INTO brands (brand_name, brand_image) VALUES
      ('Senka Reklam', '/uploads/brands/senka-logo.png'),
      ('Premium Signs', '/uploads/brands/premium-logo.png')
      ON DUPLICATE KEY UPDATE brand_name=brand_name;
    `);
    console.log('Brands örnek veriler eklendi ✅');

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

    // Örnek veriler - Category
    await connection.promise().query(`
      INSERT INTO category (name) VALUES
      ('Tabela Sistemleri'),
      ('LED Harfler')
      ON DUPLICATE KEY UPDATE name=name;
    `);
    console.log('Category örnek veriler eklendi ✅');

    // Örnek veriler - Product
    await connection.promise().query(`
      INSERT INTO product (name, description, price, category_id) VALUES
      ('LED Tabela Premium', 'Yüksek kaliteli LED tabela çözümü', 2500.00, 1),
      ('3D LED Harf', 'Özelleştirilebilir 3D LED harf', 150.00, 2)
      ON DUPLICATE KEY UPDATE name=name;
    `);
    console.log('Product örnek veriler eklendi ✅');

    // Örnek veriler - Product Images
    await connection.promise().query(`
      INSERT INTO product_images (product_id, image_url, filename, is_primary, position) VALUES
      (1, '/uploads/tabela1.jpg', 'tabela1.jpg', 1, 0),
      (2, '/uploads/led-harf1.jpg', 'led-harf1.jpg', 1, 0)
      ON DUPLICATE KEY UPDATE image_url=image_url;
    `);
    console.log('Product_images örnek veriler eklendi ✅');

    await connection.promise().query(`
  CREATE TABLE IF NOT EXISTS about (
    id INT AUTO_INCREMENT PRIMARY KEY,
    headerImage VARCHAR(255) NOT NULL,
    headerText VARCHAR(255) NOT NULL,
    headerDescription TEXT NOT NULL,
    storyTitle VARCHAR(255) NOT NULL,
    storyImage VARCHAR(255) NOT NULL,
    misyonTitle VARCHAR(255) NOT NULL,
    storyDesc TEXT NOT NULL,
    misyonDescription TEXT NOT NULL,
    visyonTitle VARCHAR(255) NOT NULL,
    vizyonDescription TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`);
console.log('About tablosu oluşturuldu ✅');

    // Örnek veriler - About
    await connection.promise().query(`
      INSERT INTO about (headerImage, headerText, headerDescription, storyTitle, storyImage, misyonTitle, storyDesc, misyonDescription, visyonTitle, vizyonDescription) VALUES
      ('/uploads/about-header.jpg', 'Hakkımızda', 'Senka Reklam olarak sektörde 20 yıllık deneyimimizle hizmet vermekteyiz.', 'Hikayemiz', '/uploads/story.jpg', 'Misyonumuz', 'Firmamız 2003 yılında kurulmuş olup...', 'Müşteri memnuniyetini ön planda tutarak...', 'Vizyonumuz', 'Sektörde lider firma olmak...')
      ON DUPLICATE KEY UPDATE headerText=headerText;
    `);
    console.log('About örnek veriler eklendi ✅');

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

    // Örnek veriler - Contact
    await connection.promise().query(`
      INSERT INTO contact (headerImage, headerTitle, headerDesc, phoneTitle, phoneValue, emailTitle, emailValue, addressTitle, addressValue, workhoursTitle, workHoursDesc, facebookLink, instaLink, linkedinLink) VALUES
      ('/uploads/contact-header.jpg', 'İletişim', 'Bize ulaşın, size yardımcı olalım', 'Telefon', '+90 532 123 45 67', 'E-posta', 'info@senkareklam.com', 'Adres', 'İstanbul, Türkiye', 'Çalışma Saatleri', 'Pazartesi - Cuma: 09:00 - 18:00', 'https://facebook.com/senkareklam', 'https://instagram.com/senkareklam', 'https://linkedin.com/company/senkareklam')
      ON DUPLICATE KEY UPDATE headerTitle=headerTitle;
    `);
    console.log('Contact örnek veriler eklendi ✅');

await connection.promise().query(`
  CREATE TABLE IF NOT EXISTS light_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lightTitle VARCHAR(255) NOT NULL,
    lightPrice DECIMAL(10,2) NOT NULL,
    lightIcon TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`);
console.log('light_settings tablosu oluşturuldu ✅');

    // Örnek veriler - Light Settings
    await connection.promise().query(`
      INSERT INTO light_settings (lightTitle, lightPrice, lightIcon) VALUES
      ('LED Aydınlatma', 100.00, '<svg>...</svg>'),
      ('Neon Aydınlatma', 150.00, '<svg>...</svg>')
      ON DUPLICATE KEY UPDATE lightTitle=lightTitle;
    `);
    console.log('light_settings örnek veriler eklendi ✅');

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

    // Örnek veriler - Letter Materials
    await connection.promise().query(`
      INSERT INTO letter_materials (light_id, name, price) VALUES
      (1, 'Akrilik', 50.00),
      (1, 'Paslanmaz Çelik', 120.00)
      ON DUPLICATE KEY UPDATE name=name;
    `);
    console.log('letter_materials örnek veriler eklendi ✅');

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

    // Örnek veriler - Letter Heights
    await connection.promise().query(`
      INSERT INTO letter_heights (light_id, name, price) VALUES
      (1, '10 cm', 30.00),
      (1, '20 cm', 60.00)
      ON DUPLICATE KEY UPDATE name=name;
    `);
    console.log('letter_heights örnek veriler eklendi ✅');

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

    // Örnek veriler - Backgrounds
    await connection.promise().query(`
      INSERT INTO backgrounds (light_id, name, price) VALUES
      (1, 'Şeffaf Pleksi', 80.00),
      (1, 'Mat Beyaz', 90.00)
      ON DUPLICATE KEY UPDATE name=name;
    `);
    console.log('backgrounds örnek veriler eklendi ✅');

await connection.promise().query(`
  CREATE TABLE IF NOT EXISTS signboard (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    user_email VARCHAR(100) NOT NULL,
    user_phone VARCHAR(20) NOT NULL,
    signboard_text VARCHAR(255) NOT NULL,
    font_family VARCHAR(100) NOT NULL,
    font_size INT NOT NULL,
    lighting_type VARCHAR(100) NOT NULL,
    letter_material VARCHAR(100) NOT NULL,
    letter_height INT NOT NULL,
    background_type VARCHAR(100) NOT NULL,
    background_color VARCHAR(50) NOT NULL,
    width INT NOT NULL,
    height INT NOT NULL,
    is_actions TINYINT(1) DEFAULT 0,
    total_price DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`);
console.log('signboard tablosu oluşturuldu ✅');

    // Örnek veriler - Signboard
    await connection.promise().query(`
      INSERT INTO signboard (username, user_email, user_phone, signboard_text, font_family, font_size, lighting_type, letter_material, letter_height, background_type, background_color, width, height, is_actions, total_price) VALUES
      ('Ahmet Yılmaz', 'ahmet@example.com', '05321234567', 'Senka Reklam', 'Arial', 24, 'LED', 'Akrilik', 15, 'Şeffaf', '#FFFFFF', 100, 50, 0, 1500.00),
      ('Mehmet Demir', 'mehmet@example.com', '05339876543', 'Premium Store', 'Roboto', 30, 'Neon', 'Metal', 20, 'Mat', '#000000', 150, 60, 1, 2200.00)
      ON DUPLICATE KEY UPDATE username=username;
    `);
    console.log('signboard örnek veriler eklendi ✅');

await connection.promise().query(`
  CREATE TABLE IF NOT EXISTS signboard_light_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    icon TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`);
console.log('signboard_light_types tablosu oluşturuldu ✅');

    // Örnek veriler - Signboard Light Types
    await connection.promise().query(`
      INSERT INTO signboard_light_types (title, description, price, icon) VALUES
      ('LED Işıklandırma', 'Yüksek verimli LED aydınlatma sistemi', 200.00, '<svg>...</svg>'),
      ('Neon Işıklandırma', 'Klasik neon tüp aydınlatma', 300.00, '<svg>...</svg>')
      ON DUPLICATE KEY UPDATE title=title;
    `);
    console.log('signboard_light_types örnek veriler eklendi ✅');

await connection.promise().query(`
  CREATE TABLE IF NOT EXISTS signboard_front_materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`);
console.log('signboard_front_materials tablosu oluşturuldu ✅');

    // Örnek veriler - Signboard Front Materials
    await connection.promise().query(`
      INSERT INTO signboard_front_materials (name, price) VALUES
      ('Akrilik Ön Yüz', 150.00),
      ('Alüminyum Kompozit', 250.00)
      ON DUPLICATE KEY UPDATE name=name;
    `);
    console.log('signboard_front_materials örnek veriler eklendi ✅');

await connection.promise().query(`
  CREATE TABLE IF NOT EXISTS signboard_letter_heights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    height VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`);
console.log('letter_heights tablosu oluşturuldu ✅');

    // Örnek veriler - Signboard Letter Heights
    await connection.promise().query(`
      INSERT INTO signboard_letter_heights (height, price) VALUES
      ('15 cm', 100.00),
      ('25 cm', 180.00)
      ON DUPLICATE KEY UPDATE height=height;
    `);
    console.log('signboard_letter_heights örnek veriler eklendi ✅');

await connection.promise().query(`
  CREATE TABLE IF NOT EXISTS signboard_background_colors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`);
console.log('background_colors tablosu oluşturuldu ✅');

    // Örnek veriler - Signboard Background Colors
    await connection.promise().query(`
      INSERT INTO signboard_background_colors (title, price) VALUES
      ('Beyaz Arka Plan', 75.00),
      ('Siyah Arka Plan', 75.00)
      ON DUPLICATE KEY UPDATE title=title;
    `);
    console.log('signboard_background_colors örnek veriler eklendi ✅');

await connection.promise().query(`
  CREATE TABLE IF NOT EXISTS sliders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sliderImage TEXT NOT NULL,
    sliderTitle VARCHAR(255) NOT NULL,
    sliderDesc TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`);
console.log('sliders tablosu oluşturuldu ✅');

    // Örnek veriler - Sliders
    await connection.promise().query(`
      INSERT INTO sliders (sliderImage, sliderTitle, sliderDesc) VALUES
      ('/uploads/slider1.jpg', 'Profesyonel Tabela Çözümleri', 'İşletmeniz için özel tasarım tabela sistemleri'),
      ('/uploads/slider2.jpg', 'LED Aydınlatma', 'Enerji tasarruflu ve uzun ömürlü LED teknolojisi')
      ON DUPLICATE KEY UPDATE sliderTitle=sliderTitle;
    `);
    console.log('sliders örnek veriler eklendi ✅');

    console.log('Tüm tablolar başarıyla oluşturuldu 🎉');
    process.exit(0);
  } catch (err) {
    console.error('Tablo oluşturma hatası ❌', err);
    process.exit(1);
  }
};

createTables();
