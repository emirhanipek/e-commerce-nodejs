-- Senka Reklam E-Commerce Database Schema
-- Tüm tabloları ve örnek verileri içeren SQL dosyası

-- 1. Category Tablosu
CREATE TABLE IF NOT EXISTS category (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Product Tablosu
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

-- 3. Brands Tablosu
CREATE TABLE IF NOT EXISTS brands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  brand_name VARCHAR(255) NOT NULL,
  brand_image VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Product Images Tablosu
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

-- 5. About Tablosu
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

-- 6. Contact Tablosu
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

-- 7. Light Settings Tablosu
CREATE TABLE IF NOT EXISTS light_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lightTitle VARCHAR(255) NOT NULL,
  lightPrice DECIMAL(10,2) NOT NULL,
  lightIcon TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Letter Materials Tablosu
CREATE TABLE IF NOT EXISTS letter_materials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  light_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (light_id) REFERENCES light_settings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Letter Heights Tablosu
CREATE TABLE IF NOT EXISTS letter_heights (
  id INT AUTO_INCREMENT PRIMARY KEY,
  light_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (light_id) REFERENCES light_settings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Backgrounds Tablosu
CREATE TABLE IF NOT EXISTS backgrounds (
  id INT AUTO_INCREMENT PRIMARY KEY,
  light_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (light_id) REFERENCES light_settings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Signboard Tablosu
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

-- 12. Signboard Light Types Tablosu
CREATE TABLE IF NOT EXISTS signboard_light_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. Signboard Front Materials Tablosu
CREATE TABLE IF NOT EXISTS signboard_front_materials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. Signboard Letter Heights Tablosu
CREATE TABLE IF NOT EXISTS signboard_letter_heights (
  id INT AUTO_INCREMENT PRIMARY KEY,
  height VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 15. Signboard Background Colors Tablosu
CREATE TABLE IF NOT EXISTS signboard_background_colors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 16. Sliders Tablosu
CREATE TABLE IF NOT EXISTS sliders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sliderImage TEXT NOT NULL,
  sliderTitle VARCHAR(255) NOT NULL,
  sliderDesc TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- ÖRNEK VERİLER (SAMPLE DATA)
-- ========================================

-- Category Örnek Verileri
INSERT INTO category (name) VALUES
('Tabela Sistemleri'),
('LED Harfler')
ON DUPLICATE KEY UPDATE name=name;

-- Brands Örnek Verileri
INSERT INTO brands (brand_name, brand_image) VALUES
('Senka Reklam', '/uploads/brands/senka-logo.png'),
('Premium Signs', '/uploads/brands/premium-logo.png')
ON DUPLICATE KEY UPDATE brand_name=brand_name;

-- Product Örnek Verileri
INSERT INTO product (name, description, price, category_id) VALUES
('LED Tabela Premium', 'Yüksek kaliteli LED tabela çözümü', 2500.00, 1),
('3D LED Harf', 'Özelleştirilebilir 3D LED harf', 150.00, 2)
ON DUPLICATE KEY UPDATE name=name;

-- Product Images Örnek Verileri
INSERT INTO product_images (product_id, image_url, filename, is_primary, position) VALUES
(1, '/uploads/tabela1.jpg', 'tabela1.jpg', 1, 0),
(2, '/uploads/led-harf1.jpg', 'led-harf1.jpg', 1, 0)
ON DUPLICATE KEY UPDATE image_url=image_url;

-- About Örnek Verileri
INSERT INTO about (headerImage, headerText, headerDescription, storyTitle, storyImage, misyonTitle, storyDesc, misyonDescription, visyonTitle, vizyonDescription) VALUES
('/uploads/about-header.jpg', 'Hakkımızda', 'Senka Reklam olarak sektörde 20 yıllık deneyimimizle hizmet vermekteyiz.', 'Hikayemiz', '/uploads/story.jpg', 'Misyonumuz', 'Firmamız 2003 yılında kurulmuş olup...', 'Müşteri memnuniyetini ön planda tutarak...', 'Vizyonumuz', 'Sektörde lider firma olmak...')
ON DUPLICATE KEY UPDATE headerText=headerText;

-- Contact Örnek Verileri
INSERT INTO contact (headerImage, headerTitle, headerDesc, phoneTitle, phoneValue, emailTitle, emailValue, addressTitle, addressValue, workhoursTitle, workHoursDesc, facebookLink, instaLink, linkedinLink) VALUES
('/uploads/contact-header.jpg', 'İletişim', 'Bize ulaşın, size yardımcı olalım', 'Telefon', '+90 532 123 45 67', 'E-posta', 'info@senkareklam.com', 'Adres', 'İstanbul, Türkiye', 'Çalışma Saatleri', 'Pazartesi - Cuma: 09:00 - 18:00', 'https://facebook.com/senkareklam', 'https://instagram.com/senkareklam', 'https://linkedin.com/company/senkareklam')
ON DUPLICATE KEY UPDATE headerTitle=headerTitle;

-- Light Settings Örnek Verileri
INSERT INTO light_settings (lightTitle, lightPrice, lightIcon) VALUES
('LED Aydınlatma', 100.00, '<svg>...</svg>'),
('Neon Aydınlatma', 150.00, '<svg>...</svg>')
ON DUPLICATE KEY UPDATE lightTitle=lightTitle;

-- Letter Materials Örnek Verileri
INSERT INTO letter_materials (light_id, name, price) VALUES
(1, 'Akrilik', 50.00),
(1, 'Paslanmaz Çelik', 120.00)
ON DUPLICATE KEY UPDATE name=name;

-- Letter Heights Örnek Verileri
INSERT INTO letter_heights (light_id, name, price) VALUES
(1, '10 cm', 30.00),
(1, '20 cm', 60.00)
ON DUPLICATE KEY UPDATE name=name;

-- Backgrounds Örnek Verileri
INSERT INTO backgrounds (light_id, name, price) VALUES
(1, 'Şeffaf Pleksi', 80.00),
(1, 'Mat Beyaz', 90.00)
ON DUPLICATE KEY UPDATE name=name;

-- Signboard Örnek Verileri
INSERT INTO signboard (username, user_email, user_phone, signboard_text, font_family, font_size, lighting_type, letter_material, letter_height, background_type, background_color, width, height, is_actions, total_price) VALUES
('Ahmet Yılmaz', 'ahmet@example.com', '05321234567', 'Senka Reklam', 'Arial', 24, 'LED', 'Akrilik', 15, 'Şeffaf', '#FFFFFF', 100, 50, 0, 1500.00),
('Mehmet Demir', 'mehmet@example.com', '05339876543', 'Premium Store', 'Roboto', 30, 'Neon', 'Metal', 20, 'Mat', '#000000', 150, 60, 1, 2200.00)
ON DUPLICATE KEY UPDATE username=username;

-- Signboard Light Types Örnek Verileri
INSERT INTO signboard_light_types (title, description, price, icon) VALUES
('LED Işıklandırma', 'Yüksek verimli LED aydınlatma sistemi', 200.00, '<svg>...</svg>'),
('Neon Işıklandırma', 'Klasik neon tüp aydınlatma', 300.00, '<svg>...</svg>')
ON DUPLICATE KEY UPDATE title=title;

-- Signboard Front Materials Örnek Verileri
INSERT INTO signboard_front_materials (name, price) VALUES
('Akrilik Ön Yüz', 150.00),
('Alüminyum Kompozit', 250.00)
ON DUPLICATE KEY UPDATE name=name;

-- Signboard Letter Heights Örnek Verileri
INSERT INTO signboard_letter_heights (height, price) VALUES
('15 cm', 100.00),
('25 cm', 180.00)
ON DUPLICATE KEY UPDATE height=height;

-- Signboard Background Colors Örnek Verileri
INSERT INTO signboard_background_colors (title, price) VALUES
('Beyaz Arka Plan', 75.00),
('Siyah Arka Plan', 75.00)
ON DUPLICATE KEY UPDATE title=title;

-- Sliders Örnek Verileri
INSERT INTO sliders (sliderImage, sliderTitle, sliderDesc) VALUES
('/uploads/slider1.jpg', 'Profesyonel Tabela Çözümleri', 'İşletmeniz için özel tasarım tabela sistemleri'),
('/uploads/slider2.jpg', 'LED Aydınlatma', 'Enerji tasarruflu ve uzun ömürlü LED teknolojisi')
ON DUPLICATE KEY UPDATE sliderTitle=sliderTitle;
