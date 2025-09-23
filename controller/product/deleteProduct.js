const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const connection = require('../../db/mysql');

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ message: 'Geçerli bir Product ID gerekli.' });
  }

  const dbConnection = await connection.promise();
  
  try {
    // Start transaction
    await dbConnection.beginTransaction();
    
    // Önce görselleri al
    const [images] = await dbConnection.query(
      `SELECT filename FROM product_images WHERE product_id = ?`,
      [id]
    );

    // Ürünü sil (CASCADE ile product_images de silinir)
    const [result] = await dbConnection.query(
      `DELETE FROM product WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      await dbConnection.rollback();
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }

    // Commit transaction first
    await dbConnection.commit();

    // Sunucudan dosyaları sil (transaction dışında)
    const deletePromises = images.map(async (img) => {
      if (img.filename) {
        const filePath = path.join(__dirname, '../../uploads', img.filename);
        try {
          // Check if file exists before attempting to delete
          if (fsSync.existsSync(filePath)) {
            await fs.unlink(filePath);
            console.log(`Dosya silindi: ${img.filename}`);
          }
        } catch (fileError) {
          // Log file deletion error but don't fail the entire operation
          console.error(`Dosya silinirken hata oluştu: ${img.filename}`, fileError);
        }
      }
    });

    // Wait for all file deletions to complete
    await Promise.allSettled(deletePromises);

    console.log(`Ürün ve görselleri silindi ✅ ID: ${id}`);
    res.status(200).json({ 
      success: true,
      message: 'Ürün ve görselleri silindi.', 
      id: parseInt(id),
      deletedImages: images.length 
    });
  } catch (err) {
    // Rollback transaction if it's still active
    try {
      await dbConnection.rollback();
    } catch (rollbackError) {
      console.error('Rollback hatası:', rollbackError);
    }
    
    console.error('Ürün silme hatası ❌', err);
    
    // Different error responses for development vs production
    if (process.env.NODE_ENV === 'development') {
      res.status(500).json({ 
        success: false,
        message: 'Ürün silinemedi.', 
        error: err.message,
        stack: err.stack 
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: 'Ürün silinemedi.' 
      });
    }
  }
};

module.exports = deleteProduct;