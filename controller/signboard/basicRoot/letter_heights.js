const connection = require('../../../services/mysql');

// CREATE - Yeni bir harf yüksekliği oluştur
async function createLetterHeight(req, res) {
  const { height, price } = req.body;

  // Zorunlu alanları kontrol et
  if (!height || !price) {
    return res.status(400).json({ 
      success: false, 
      message: 'Tüm alanlar zorunludur (height, price)' 
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
      `INSERT INTO signboard_letter_heights (height, price) VALUES (?, ?)`,
      [height, parseFloat(price)]
    );

    res.status(201).json({
      success: true,
      message: 'Harf yüksekliği başarıyla oluşturuldu',
      data: {
        id: result.insertId,
        height,
        price: parseFloat(price)
      }
    });
  } catch (error) {
    console.error('Error creating letter height:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sunucu hatası' 
    });
  }
}

// READ ALL - Tüm harf yüksekliklerini getir
async function getAllLetterHeights(req, res) {
  try {
    const [letterHeights] = await connection.promise().query(
      'SELECT * FROM signboard_letter_heights ORDER BY price ASC'
    );

    res.status(200).json({
      success: true,
      count: letterHeights.length,
      data: letterHeights
    });
  } catch (error) {
    console.error('Error fetching letter heights:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sunucu hatası' 
    });
  }
}


// UPDATE - Harf yüksekliğini güncelle
async function updateLetterHeight(req, res) {
  const { id } = req.params;
  const { height, price } = req.body;

  // ID'nin geçerli bir sayı olduğunu kontrol et
  if (!id || isNaN(id)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Geçerli bir ID gereklidir' 
    });
  }

  // En az bir güncelleme alanının olduğunu kontrol et
  if (!height && !price) {
    return res.status(400).json({ 
      success: false, 
      message: 'Güncellenecek en az bir alan belirtmelisiniz (height veya price)' 
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
      'SELECT * FROM signboard_letter_heights WHERE id = ?',
      [parseInt(id)]
    );

    if (existingRecord.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Harf yüksekliği bulunamadı' 
      });
    }

    // Güncelleme sorgusu oluştur
    const updateFields = [];
    const updateValues = [];

    if (height) {
      updateFields.push('height = ?');
      updateValues.push(height);
    }
    if (price !== undefined) {
      updateFields.push('price = ?');
      updateValues.push(parseFloat(price));
    }

    updateValues.push(parseInt(id));

    const [result] = await connection.promise().query(
      `UPDATE signboard_letter_heights SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Harf yüksekliği bulunamadı' 
      });
    }

    // Güncellenmiş kaydı getir
    const [updatedRecord] = await connection.promise().query(
      'SELECT * FROM signboard_letter_heights WHERE id = ?',
      [parseInt(id)]
    );

    res.status(200).json({
      success: true,
      message: 'Harf yüksekliği başarıyla güncellendi',
      data: updatedRecord[0]
    });
  } catch (error) {
    console.error('Error updating letter height:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sunucu hatası' 
    });
  }
}

// DELETE - Harf yüksekliğini sil
async function deleteLetterHeight(req, res) {
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
      'SELECT * FROM signboard_letter_heights WHERE id = ?',
      [parseInt(id)]
    );

    if (existingRecord.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Harf yüksekliği bulunamadı' 
      });
    }

    const [result] = await connection.promise().query(
      'DELETE FROM signboard_letter_heights WHERE id = ?',
      [parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Harf yüksekliği bulunamadı' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Harf yüksekliği başarıyla silindi',
      data: existingRecord[0]
    });
  } catch (error) {
    console.error('Error deleting letter height:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sunucu hatası' 
    });
  }
}

module.exports = {
  createLetterHeight,
  getAllLetterHeights,
  updateLetterHeight,
  deleteLetterHeight
};