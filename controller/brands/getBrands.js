const connection = require('../../services/mysql');

async function getBrands(req, res) {
  try {
    const [brands] = await connection.promise().query(
      'SELECT * FROM brands ORDER BY created_at DESC'
    );

    // Her brand için image_url ekle
    const brandsWithImageUrl = brands.map(brand => ({
      ...brand,
      image_url: `/uploads/brands/${brand.brand_image}`
    }));

    res.status(200).json({
      success: true,
      count: brands.length,
      data: brandsWithImageUrl
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = getBrands;