# 🛒 Sergio Ferrari E-Commerce Backend

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com/)

*Modern ve güvilir e-ticaret backend API servisi*

</div>

## 📖 Proje Hakkında

Bu proje, **Sergio Ferrari** markası için geliştirilmiş modern bir e-ticaret backend servisidir. RESTful API mimarisi ile ürün ve kategori yönetimi sunmaktadır.

### 🌟 Özellikler

- ✅ **RESTful API** - Standart HTTP metodları ile API tasarımı
- ✅ **MySQL Veritabanı** - Güvenilir veri saklama
- ✅ **Docker Desteği** - Kolay kurulum ve dağıtım
- ✅ **CORS Desteği** - Frontend entegrasyonu için hazır
- ✅ **MVC Mimarisi** - Temiz ve sürdürülebilir kod yapısı
- ✅ **Otomatik Tablo Oluşturma** - Kolay veritabanı kurulumu

## 🏗️ Proje Yapısı

```
backend/
├── 📁 controller/          # API kontrolcüleri
│   ├── 📁 product.js/     # Ürün işlemleri
│   └── 📁 category/       # Kategori işlemleri
├── 📁 router/             # API route tanımları
│   ├── 📄 product.js      # Ürün rotaları
│   └── 📄 category.js     # Kategori rotaları
├── 📁 services/           # Servis katmanı
│   └── 📄 mysql.js        # Veritabanı bağlantısı
├── 📁 migrations/         # Veritabanı şeması
│   └── 📄 initDb.js       # Tablo oluşturma
├── 📄 index.js            # Ana uygulama dosyası
├── 📄 package.json        # Proje bağımlılıkları
├── 📄 Dockerfile          # Docker yapılandırması
└── 📄 docker-compose.yml  # Çoklu konteyner yönetimi
```

## 🚀 Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- MySQL (v8 veya üzeri)
- Docker (opsiyonel)

### 1️⃣ Hızlı Başlangıç (Docker ile)

```bash
# Projeyi klonlayın
git clone <repository-url>
cd backend

# Docker ile başlatın
docker-compose up -d

# Veritabanı tablolarını oluşturun
docker exec my-backend npm run migrate
```

### 2️⃣ Manuel Kurulum

```bash
# Bağımlılıkları yükleyin
npm install

# Çevre değişkenlerini ayarlayın
cp .env.example .env

# Veritabanı tablolarını oluşturun
node migrations/initDb.js

# Geliştirme sunucusunu başlatın
npm run dev
```

## ⚙️ Yapılandırma

### Çevre Değişkenleri (.env)

```env
DB_HOST=localhost
DB_USER=user
DB_PASSWORD=user123
DB_NAME=mydb
PORT=3000
```

### Veritabanı Şeması

**Category Tablosu:**
```sql
CREATE TABLE category (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Product Tablosu:**
```sql
CREATE TABLE product (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE SET NULL
);
```

## 📡 API Endpoints

### 🏷️ Kategoriler

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `GET` | `/category` | Tüm kategorileri listele |
| `GET` | `/category/:id` | Belirli kategoriyi getir |
| `POST` | `/category` | Yeni kategori oluştur |
| `PUT` | `/category/:id` | Kategori güncelle |
| `DELETE` | `/category/:id` | Kategori sil |

### 📦 Ürünler

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `GET` | `/products` | Tüm ürünleri listele |
| `GET` | `/products/:id` | Belirli ürünü getir |
| `POST` | `/products` | Yeni ürün oluştur |
| `PUT` | `/products/:id` | Ürün güncelle |
| `DELETE` | `/products/:id` | Ürün sil |

### 📋 Örnek API Kullanımı

#### Kategori Oluşturma
```bash
curl -X POST http://localhost:3000/category \
  -H "Content-Type: application/json" \
  -d '{"name": "Elektronik"}'
```

#### Ürün Oluşturma
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15",
    "description": "En yeni iPhone modeli",
    "price": 35000.00,
    "category_id": 1
  }'
```

## 🛠️ Geliştirme

### NPM Komutları

```bash
# Geliştirme sunucusunu başlat (otomatik yeniden başlatma)
npm run dev

# Üretim sunucusunu başlat
npm start

# Testleri çalıştır
npm test
```

### Docker Komutları

```bash
# Tüm servisleri başlat
docker-compose up -d

# Logları görüntüle
docker-compose logs -f backend

# Servisleri durdur
docker-compose down

# Veritabanı verilerini temizle
docker-compose down -v
```

## 🔧 Teknoloji Stack

| Teknoloji | Versiyon | Kullanım Amacı |
|-----------|----------|----------------|
| **Node.js** | v16+ | JavaScript runtime |
| **Express.js** | v5.1.0 | Web framework |
| **MySQL2** | v3.14.5 | Veritabanı bağlantısı |
| **CORS** | v2.8.5 | Cross-origin requests |
| **dotenv** | v17.2.2 | Çevre değişkenleri |
| **Nodemon** | v3.1.10 | Geliştirme süreci |

## 📊 Performans ve Monitoring

- **Port:** 3000 (varsayılan)
- **Veritabanı Bağlantısı:** MySQL 8.0
- **CORS:** Tüm originlere açık (geliştirme için)

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Commit yapın (`git commit -am 'Yeni özellik eklendi'`)
4. Branch'i push edin (`git push origin feature/yeni-ozellik`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

<div align="center">

**Sergio Ferrari E-Commerce Backend** ile güçlü ve ölçeklenebilir e-ticaret çözümleri 🚀

*Geliştirici: [Your Name]*

</div>
