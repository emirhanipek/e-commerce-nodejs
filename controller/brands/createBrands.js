const connection = require('../../services/mysql');
const multer = require('multer');
const path = require('path');

// Brands için özel multer konfigürasyonu
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/brands/'); // uploads/brands klasörüne kaydedilecek
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if(file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Sadece görsel yüklenebilir'), false);
  }
};

const brandUpload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // max 15MB
  fileFilter: fileFilter
});

async function createBrands(req, res) {
  // Multer middleware'ini manuel olarak çalıştır
  brandUpload.single('brand_image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    const { brand_name } = req.body;
    const brand_image = req.file ? req.file.filename : null;

    if (!brand_name || !brand_image) {
      return res.status(400).json({ success: false, message: 'Brand adı ve resim zorunludur.' });
    }

    try {
      const [result] = await connection.promise().query(
        `INSERT INTO brands (brand_name, brand_image) VALUES (?, ?)`,
        [brand_name, brand_image]
      );

      res.status(201).json({
        success: true,
        data: {
          id: result.insertId,
          brand_name,
          brand_image,
          image_url: `/uploads/brands/${brand_image}`
        }
      });
    } catch (error) {
      console.error('Error creating brand:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
}

module.exports = createBrands;