const connection = require('../../db/mysql');

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category_id } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Product ID gerekli.' });
  }

  try {
    // 1️⃣ Product bilgilerini güncelle
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

    // 2️⃣ Yeni görselleri ekle
    if (req.files && req.files.length > 0) {
      const files = req.files;

      // values array: [product_id, image_url, filename, is_primary, position]
      const values = files.map((file, index) => [
        id,
        `/uploads/${file.filename}`,
        file.filename,
        index === 0 ? 1 : 0, // İlk görsel primary
        index
      ]);

      await connection.promise().query(
        `INSERT INTO product_images (product_id, image_url, filename, is_primary, position)
         VALUES ?`,
        [values]
      );

      console.log(`${files.length} görsel eklendi ✅`);
    }

    res.status(200).json({ message: 'Ürün güncellendi.', id });
  } catch (err) {
    console.error('Ürün güncelleme hatası ❌', err);
    res.status(500).json({ message: 'Ürün güncellenemedi.', error: err.message });
  }
};

module.exports = updateProduct;
