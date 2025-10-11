const connection = require('../../../services/mysql');

// CREATE - Yeni bir ön yüz malzemesi oluştur
async function createFrontMaterial(req, res) {
  const { name, price } = req.body;

  // Zorunlu alanları kontrol et
  if (!name || !price) {
    return res.status(400).json({ 
      success: false, 
      message: 'Tüm alanlar zorunludur (name, price)' 
    });
  }

  // Price'ın geçerli bir sayı olduğunu kontrol et
  if (isNaN(price) || parseFloat(price) < 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Fiyat geçerli bir pozitif sayı olmalıdır' 
    });
  }

  try {
    const [result] = await connection.promise().query(
      `INSERT INTO signboard_front_materials (name, price) VALUES (?, ?)`,
      [name, parseFloat(price)]
    );

    res.status(201).json({
      success: true,
      message: 'Ön yüz malzemesi başarıyla oluşturuldu',
      data: {
        id: result.insertId,
        name,
        price: parseFloat(price)
      }
    });
  } catch (error) {
    console.error('Error creating front material:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sunucu hatası' 
    });
  }
}

// READ ALL - Tüm ön yüz malzemelerini getir
async function getAllFrontMaterials(req, res) {
  try {
    const [frontMaterials] = await connection.promise().query(
      'SELECT * FROM signboard_front_materials ORDER BY name ASC'
    );

    res.status(200).json({
      success: true,
      count: frontMaterials.length,
      data: frontMaterials
    });
  } catch (error) {
    console.error('Error fetching front materials:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sunucu hatası' 
    });
  }
}

// UPDATE - Ön yüz malzemesini güncelle
async function updateFrontMaterial(req, res) {
  const { id } = req.params;
  const { name, price } = req.body;

  // ID'nin geçerli bir sayı olduğunu kontrol et
  if (!id || isNaN(id)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Geçerli bir ID gereklidir' 
    });
  }

  // En az bir güncelleme alanının olduğunu kontrol et
  if (!name && !price) {
    return res.status(400).json({ 
      success: false, 
      message: 'Güncellenecek en az bir alan belirtmelisiniz (name veya price)' 
    });
  }

  // Price varsa geçerli olduğunu kontrol et
  if (price !== undefined && (isNaN(price) || parseFloat(price) < 0)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Fiyat geçerli bir pozitif sayı olmalıdır' 
    });
  }

  try {
    // Önce kayıt var mı kontrol et
    const [existingRecord] = await connection.promise().query(
      'SELECT * FROM signboard_front_materials WHERE id = ?',
      [parseInt(id)]
    );

    if (existingRecord.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Ön yüz malzemesi bulunamadı' 
      });
    }

    // Güncelleme sorgusu oluştur
    const updateFields = [];
    const updateValues = [];

    if (name) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (price !== undefined) {
      updateFields.push('price = ?');
      updateValues.push(parseFloat(price));
    }

    updateValues.push(parseInt(id));

    const [result] = await connection.promise().query(
      `UPDATE signboard_front_materials SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Ön yüz malzemesi bulunamadı' 
      });
    }

    // Güncellenmiş kaydı getir
    const [updatedRecord] = await connection.promise().query(
      'SELECT * FROM signboard_front_materials WHERE id = ?',
      [parseInt(id)]
    );

    res.status(200).json({
      success: true,
      message: 'Ön yüz malzemesi başarıyla güncellendi',
      data: updatedRecord[0]
    });
  } catch (error) {
    console.error('Error updating front material:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sunucu hatası' 
    });
  }
}

// DELETE - Ön yüz malzemesini sil
async function deleteFrontMaterial(req, res) {
  const { id } = req.params;

  // ID'nin geçerli bir sayı olduğunu kontrol et
  if (!id || isNaN(id)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Geçerli bir ID gereklidir' 
    });
  }

  try {
    // Önce kayıt var mı kontrol et
    const [existingRecord] = await connection.promise().query(
      'SELECT * FROM signboard_front_materials WHERE id = ?',
      [parseInt(id)]
    );

    if (existingRecord.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Ön yüz malzemesi bulunamadı' 
      });
    }

    const [result] = await connection.promise().query(
      'DELETE FROM signboard_front_materials WHERE id = ?',
      [parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Ön yüz malzemesi bulunamadı' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ön yüz malzemesi başarıyla silindi',
      data: existingRecord[0]
    });
  } catch (error) {
    console.error('Error deleting front material:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sunucu hatası' 
    });
  }
}

module.exports = {
  createFrontMaterial,
  getAllFrontMaterials,
  updateFrontMaterial,
  deleteFrontMaterial
};