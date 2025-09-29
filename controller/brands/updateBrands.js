const connection = require('../../services/mysql');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

async function updateBrands(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Brand ID gereklidir.' });
  }

  // Multer middleware'ini manuel olarak çal1_t1r
  brandUpload.single('brand_image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    const { brand_name } = req.body;
    const new_brand_image = req.file ? req.file.filename : null;

    if (!brand_name) {
      return res.status(400).json({ success: false, message: 'Brand ad1 zorunludur.' });
    }

    try {
      // Önce mevcut brand bilgilerini al
      const [existingBrand] = await connection.promise().query(
        'SELECT * FROM brands WHERE id = ?',
        [id]
      );

      if (existingBrand.length === 0) {
        return res.status(404).json({ success: false, message: 'Brand bulunamad1.' });
      }

      let updateQuery = 'UPDATE brands SET brand_name = ?';
      let updateParams = [brand_name];

      // Eer yeni resim yüklendiyse
      if (new_brand_image) {
        updateQuery += ', brand_image = ?';
        updateParams.push(new_brand_image);

        // Eski resim dosyas1n1 sil
        if (existingBrand[0].brand_image) {
          const oldImagePath = path.join('uploads/brands', existingBrand[0].brand_image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      }

      updateQuery += ' WHERE id = ?';
      updateParams.push(id);

      const [result] = await connection.promise().query(updateQuery, updateParams);

      res.status(200).json({
        success: true,
        data: {
          id,
          brand_name,
          brand_image: new_brand_image || existingBrand[0].brand_image,
          image_url: `/uploads/brands/${new_brand_image || existingBrand[0].brand_image}`
        }
      });
    } catch (error) {
      console.error('Error updating brand:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
}

module.exports = updateBrands;