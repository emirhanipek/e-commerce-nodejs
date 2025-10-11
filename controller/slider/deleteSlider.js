const connection = require('../../services/mysql');
const fs = require('fs');

async function deleteSlider(req, res) {
  const { id } = req.params;

  try {
    // Önce slider'ı alalım (resim dosyasını silmek için)
    const [slider] = await connection.promise().query(
      'SELECT * FROM sliders WHERE id = ?',
      [id]
    );

    if (slider.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Slider bulunamadı'
      });
    }

    // Database'den sil
    await connection.promise().query(
      'DELETE FROM sliders WHERE id = ?',
      [id]
    );

    // Resim dosyasını sil (eğer varsa)
    if (slider[0].sliderImage && fs.existsSync(slider[0].sliderImage)) {
      fs.unlinkSync(slider[0].sliderImage);
    }

    res.status(200).json({
      success: true,
      message: 'Slider başarıyla silindi'
    });
  } catch (error) {
    console.error('Error deleting slider:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

module.exports = deleteSlider;
