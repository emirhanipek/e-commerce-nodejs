const connection = require('../../services/mysql');

const createProduct = async (req, res) => {
  const { name, description, price, category_id } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: 'Name ve price alanları zorunludur.' });
  }

  try {
    const [result] = await connection.promise().query(
      `INSERT INTO product (name, description, price, category_id)
       VALUES (?, ?, ?, ?)`,
      [name, description || null, price, category_id || null]
    );

    console.log('Yeni ürün oluşturuldu ✅', { id: result.insertId, name, price });
    res.status(201).json({ id: result.insertId, name, description, price, category_id });
  } catch (err) {
    console.error('Ürün oluşturma hatası ❌', err);
    res.status(500).json({ message: 'Ürün oluşturulamadı', error: err.message });
  }
};

module.exports = createProduct;
