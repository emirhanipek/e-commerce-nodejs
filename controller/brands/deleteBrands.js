const connection = require('../../services/mysql');
const fs = require('fs');
const path = require('path');

async function deleteBrands(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Brand ID gereklidir.' });
  }

  try {
    // Önce brand bilgilerini al (resim dosyas1n1 silmek için)
    const [brand] = await connection.promise().query(
      'SELECT * FROM brands WHERE id = ?',
      [id]
    );

    if (brand.length === 0) {
      return res.status(404).json({ success: false, message: 'Brand bulunamad1.' });
    }

    // Brand'1 veritaban1ndan sil
    const [result] = await connection.promise().query(
      'DELETE FROM brands WHERE id = ?',
      [id]
    );

    // Resim dosyas1n1 diskten sil
    if (brand[0].brand_image) {
      const imagePath = path.join('uploads/brands', brand[0].brand_image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Brand ba_ar1yla silindi.',
      data: {
        id: brand[0].id,
        brand_name: brand[0].brand_name
      }
    });
  } catch (error) {
    console.error('Error deleting brand:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = deleteBrands;