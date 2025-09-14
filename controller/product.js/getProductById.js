const connection = require('../../services/mysql');

const getProductById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Product ID gerekli.' });
  }

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
       LEFT JOIN category c ON p.category_id = c.id
       WHERE p.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }

    console.log(`Ürün getirildi ✅ ID: ${id}`);
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Ürün getirme hatası ❌', err);
    res.status(500).json({ message: 'Ürün getirilemedi.', error: err.message });
  }
};

module.exports = getProductById;
