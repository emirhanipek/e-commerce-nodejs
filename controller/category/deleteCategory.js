const connection = require('../../db/mysql');

async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    // Input validation
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ 
        success: false, 
        message: 'Geçerli bir kategori ID gerekli' 
      });
    }

    const [result] = await connection.promise().query(
      'DELETE FROM category WHERE id = ?',
      [parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Kategori bulunamadı' 
      });
    }

    console.log(`Kategori silindi ✅ ID: ${id}`);
    res.status(200).json({ 
      success: true, 
      message: 'Kategori başarıyla silindi',
      id: parseInt(id)
    });
  } catch (error) {
    console.error('Kategori silme hatası:', error);
    
    // Different error responses for development vs production
    if (process.env.NODE_ENV === 'development') {
      res.status(500).json({ 
        success: false, 
        message: 'Sunucu hatası', 
        error: error.message 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Sunucu hatası' 
      });
    }
  }
}

module.exports = deleteCategory;