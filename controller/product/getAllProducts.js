const connection = require('../../db/mysql');

const getAllProducts = async (req, res) => {
  try {
    // Product + category
    const [products] = await connection.promise().query(
      `SELECT 
         p.id, 
         p.name, 
         p.description, 
         p.price, 
         p.category_id, 
         c.name AS category_name
       FROM product p
       LEFT JOIN category c ON p.category_id = c.id`
    );

    // Her product için görselleri al
    const productIds = products.map(p => p.id);
    let images = [];
    if (productIds.length > 0) {
      const [imgRows] = await connection.promise().query(
        `SELECT product_id, image_url, is_primary, position
         FROM product_images
         WHERE product_id IN (?)`,
        [productIds]
      );
      images = imgRows;
    }

    // Product ile görselleri birleştir
    const productsWithImages = products.map(p => ({
      ...p,
      images: images.filter(img => img.product_id === p.id)
    }));

    console.log('Tüm ürünler ve görseller getirildi ✅');
    res.status(200).json(productsWithImages);
  } catch (err) {
    console.error('Ürünleri getirme hatası ❌', err);
    res.status(500).json({ message: 'Ürünler getirilemedi.', error: err.message });
  }
};

module.exports = getAllProducts;
