const connection = require('../../services/mysql');

const getAllProducts = async (req, res) => {
  try {
    const [rows] = await connection.promise().query(
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

    console.log('Tüm ürünler getirildi ✅');
    res.status(200).json(rows);
  } catch (err) {
    console.error('Ürünleri getirme hatası ❌', err);
    res.status(500).json({ message: 'Ürünler getirilemedi.', error: err.message });
  }
};

module.exports = getAllProducts;
