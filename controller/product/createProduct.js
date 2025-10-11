const connection = require('../../services/mysql');

const createProduct = async (req, res) => {
  const { name, description, price, category_id } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: 'Name ve price alanları zorunludur.' });
  }

  try {
    // 1️⃣ Product ekleme
    const [result] = await connection.promise().query(
      `INSERT INTO product (name, description, price, category_id)
       VALUES (?, ?, ?, ?)`,
      [name, description || null, price, category_id || null]
    );

    const productId = result.insertId;
    console.log('Yeni ürün oluşturuldu ✅', { id: productId, name, price });

    // 2️⃣ Görselleri ekleme (multer ile yüklenen dosyalar - field adı: image_url)
    if (req.files && req.files.length > 0) {
      const files = req.files;

      // values array: [product_id, image_url, filename, is_primary, position]
      const values = files.map((file, index) => [
        productId,
        `/uploads/product/${file.filename}`, // frontend için URL
        file.filename,
        index === 0 ? 1 : 0, // ilk resim primary
        index
      ]);

      await connection.promise().query(
        `INSERT INTO product_images (product_id, image_url, filename, is_primary, position)
         VALUES ?`,
        [values]
      );

      console.log(`${files.length} görsel eklendi ✅`);
    }

    res.status(201).json({
      id: productId,
      name,
      description,
      price,
      category_id,
      images: req.files ? req.files.map(f => `/uploads/product/${f.filename}`) : []
    });
  } catch (err) {
    console.error('Ürün oluşturma hatası ❌', err);
    res.status(500).json({ message: 'Ürün oluşturulamadı', error: err.message });
  }
};

module.exports = createProduct;
