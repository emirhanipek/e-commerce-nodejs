const connection = require('../../services/mysql');

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Product ID gerekli.' });
  }

  try {
    const [result] = await connection.promise().query(
      `DELETE FROM product WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }

    console.log(`Ürün silindi ✅ ID: ${id}`);
    res.status(200).json({ message: 'Ürün silindi.', id });
  } catch (err) {
    console.error('Ürün silme hatası ❌', err);
    res.status(500).json({ message: 'Ürün silinemedi.', error: err.message });
  }
};

module.exports = deleteProduct;
