const connection = require('../../../services/mysql');

// CREATE - Yeni bir arka plan rengi oluştur
async function createBackgroundColor(req, res) {
  const { title, price } = req.body;

  // Zorunlu alanları kontrol et
  if (!title || !price) {
    return res.status(400).json({ 
      success: false, 
      message: 'Tüm alanlar zorunludur (title, price)' 
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
      `INSERT INTO signboard_background_colors (title, price) VALUES (?, ?)`,
      [title, parseFloat(price)]
    );

    res.status(201).json({
      success: true,
      message: 'Arka plan rengi başarıyla oluşturuldu',
      data: {
        id: result.insertId,
        title,
        price: parseFloat(price)
      }
    });
  } catch (error) {
    console.error('Error creating background color:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sunucu hatası' 
    });
  }
}

// READ ALL - Tüm arka plan renklerini getir
async function getAllBackgroundColors(req, res) {
  try {
    const [backgroundColors] = await connection.promise().query(
      'SELECT * FROM signboard_background_colors ORDER BY title ASC'
    );

    res.status(200).json({
      success: true,
      count: backgroundColors.length,
      data: backgroundColors
    });
  } catch (error) {
    console.error('Error fetching background colors:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sunucu hatası' 
    });
  }
}


// UPDATE - Arka plan rengini güncelle
async function updateBackgroundColor(req, res) {
  const { id } = req.params;
  const { title, price } = req.body;

  // ID'nin geçerli bir sayı olduğunu kontrol et
  if (!id || isNaN(id)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Geçerli bir ID gereklidir' 
    });
  }

  // En az bir güncelleme alanının olduğunu kontrol et
  if (!title && !price) {
    return res.status(400).json({ 
      success: false, 
      message: 'Güncellenecek en az bir alan belirtmelisiniz (title veya price)' 
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
      'SELECT * FROM signboard_background_colors WHERE id = ?',
      [parseInt(id)]
    );

    if (existingRecord.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Arka plan rengi bulunamadı' 
      });
    }

    // Güncelleme sorgusu oluştur
    const updateFields = [];
    const updateValues = [];

    if (title) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (price !== undefined) {
      updateFields.push('price = ?');
      updateValues.push(parseFloat(price));
    }

    updateValues.push(parseInt(id));

    const [result] = await connection.promise().query(
      `UPDATE signboard_background_colors SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Arka plan rengi bulunamadı' 
      });
    }

    // Güncellenmiş kaydı getir
    const [updatedRecord] = await connection.promise().query(
      'SELECT * FROM signboard_background_colors WHERE id = ?',
      [parseInt(id)]
    );

    res.status(200).json({
      success: true,
      message: 'Arka plan rengi başarıyla güncellendi',
      data: updatedRecord[0]
    });
  } catch (error) {
    console.error('Error updating background color:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sunucu hatası' 
    });
  }
}

// DELETE - Arka plan rengini sil
async function deleteBackgroundColor(req, res) {
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
      'SELECT * FROM signboard_background_colors WHERE id = ?',
      [parseInt(id)]
    );

    if (existingRecord.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Arka plan rengi bulunamadı' 
      });
    }

    const [result] = await connection.promise().query(
      'DELETE FROM signboard_background_colors WHERE id = ?',
      [parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Arka plan rengi bulunamadı' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Arka plan rengi başarıyla silindi',
      data: existingRecord[0]
    });
  } catch (error) {
    console.error('Error deleting background color:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sunucu hatası' 
    });
  }
}

module.exports = {
  createBackgroundColor,
  getAllBackgroundColors,
  updateBackgroundColor,
  deleteBackgroundColor
};