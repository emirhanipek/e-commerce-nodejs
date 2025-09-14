const connection = require('../../services/mysql');

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category_id } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Product ID gerekli.' });
  }

  try {
    const [result] = await connection.promise().query(
      `UPDATE product 
       SET name = ?, description = ?, price = ?, category_id = ? 
       WHERE id = ?`,
      [name, description || null, price, category_id || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }

    console.log(`Ürün güncellendi ✅ ID: ${id}`);
    res.status(200).json({ message: 'Ürün güncellendi.', id });
  } catch (err) {
    console.error('Ürün güncelleme hatası ❌', err);
    res.status(500).json({ message: 'Ürün güncellenemedi.', error: err.message });
  }
};

module.exports = updateProduct;
