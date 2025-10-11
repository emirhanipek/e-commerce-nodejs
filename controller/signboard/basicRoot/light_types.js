const connection = require('../../../services/mysql');

// CREATE - Yeni bir ışık türü oluştur
async function createLightType(req, res) {
  const { title, description, price, icon } = req.body;

  // Zorunlu alanları kontrol et
  if (!title || !description || !price || !icon) {
    return res.status(400).json({ 
      success: false, 
      message: 'Tüm alanlar zorunludur (title, description, price, icon)' 
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
      `INSERT INTO signboard_light_types (title, description, price, icon) VALUES (?, ?, ?, ?)`,
      [title, description, parseFloat(price), icon]
    );

    res.status(201).json({
      success: true,
      message: 'Işık türü başarıyla oluşturuldu',
      data: {
        id: result.insertId,
        title,
        description,
        price: parseFloat(price),
        icon
      }
    });
  } catch (error) {
    console.error('Error creating light type:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sunucu hatası' 
    });
  }
}

// READ ALL - Tüm ışık türlerini getir
async function getAllLightTypes(req, res) {
  try {
    const [lightTypes] = await connection.promise().query(
      'SELECT * FROM signboard_light_types ORDER BY created_at DESC'
    );

    res.status(200).json({
      success: true,
      count: lightTypes.length,
      data: lightTypes
    });
  } catch (error) {
    console.error('Error fetching light types:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sunucu hatası' 
    });
  }
}

// UPDATE - Işık türünü güncelle
async function updateLightType(req, res) {
  const { id } = req.params;
  const { title, description, price, icon } = req.body;

  // ID'nin geçerli bir sayı olduğunu kontrol et
  if (!id || isNaN(id)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Geçerli bir ID gereklidir' 
    });
  }

  // En az bir güncelleme alanının olduğunu kontrol et
  if (!title && !description && !price && !icon) {
    return res.status(400).json({ 
      success: false, 
      message: 'Güncellenecek en az bir alan belirtmelisiniz' 
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
      'SELECT * FROM signboard_light_types WHERE id = ?',
      [parseInt(id)]
    );

    if (existingRecord.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Işık türü bulunamadı' 
      });
    }

    // Güncelleme sorgusu oluştur
    const updateFields = [];
    const updateValues = [];

    if (title) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (description) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (price !== undefined) {
      updateFields.push('price = ?');
      updateValues.push(parseFloat(price));
    }
    if (icon) {
      updateFields.push('icon = ?');
      updateValues.push(icon);
    }

    updateValues.push(parseInt(id));

    const [result] = await connection.promise().query(
      `UPDATE signboard_light_types SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Işık türü bulunamadı' 
      });
    }

    // Güncellenmiş kaydı getir
    const [updatedRecord] = await connection.promise().query(
      'SELECT * FROM signboard_light_types WHERE id = ?',
      [parseInt(id)]
    );

    res.status(200).json({
      success: true,
      message: 'Işık türü başarıyla güncellendi',
      data: updatedRecord[0]
    });
  } catch (error) {
    console.error('Error updating light type:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sunucu hatası' 
    });
  }
}

// DELETE - Işık türünü sil
async function deleteLightType(req, res) {
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
      'SELECT * FROM signboard_light_types WHERE id = ?',
      [parseInt(id)]
    );

    if (existingRecord.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Işık türü bulunamadı' 
      });
    }

    const [result] = await connection.promise().query(
      'DELETE FROM signboard_light_types WHERE id = ?',
      [parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Işık türü bulunamadı' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Işık türü başarıyla silindi',
      data: existingRecord[0]
    });
  } catch (error) {
    console.error('Error deleting light type:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sunucu hatası' 
    });
  }
}

module.exports = {
  createLightType,
  getAllLightTypes,
  updateLightType,
  deleteLightType
};