const fs = require('fs');
const path = require('path');
const connection = require('../../services/mysql');

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Product ID gerekli.' });
  }

  try {
    // Önce görselleri al
    const [images] = await connection.promise().query(
      `SELECT filename FROM product_images WHERE product_id = ?`,
      [id]
    );

    // Ürünü sil (CASCADE ile product_images de silinir)
    const [result] = await connection.promise().query(
      `DELETE FROM product WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }

    // Sunucudan dosyaları sil
    images.forEach(img => {
      const filePath = path.join(__dirname, '../../uploads', img.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    console.log(`Ürün ve görselleri silindi ✅ ID: ${id}`);
    res.status(200).json({ message: 'Ürün ve görselleri silindi.', id });
  } catch (err) {
    console.error('Ürün silme hatası ❌', err);
    res.status(500).json({ message: 'Ürün silinemedi.', error: err.message });
  }
};

module.exports = deleteProduct;
