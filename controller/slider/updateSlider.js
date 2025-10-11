const connection = require('../../services/mysql');

async function updateSlider(req, res) {
  const { id } = req.params;
  const { sliderTitle, sliderDesc } = req.body;

  // Multer'dan gelen dosya: req.file (opsiyonel)
  const sliderImage = req.file?.path || null;

  if (!sliderTitle || !sliderDesc) {
    return res.status(400).json({
      success: false,
      message: 'sliderTitle ve sliderDesc zorunludur.'
    });
  }

  try {
    // Önce mevcut slider'ı alalım
    const [existing] = await connection.promise().query(
      'SELECT * FROM sliders WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Slider bulunamadı'
      });
    }

    // Resim gönderilmezse mevcut resmi koru
    const finalSliderImage = sliderImage || existing[0].sliderImage;

    const [result] = await connection.promise().query(
      'UPDATE sliders SET sliderImage = ?, sliderTitle = ?, sliderDesc = ? WHERE id = ?',
      [finalSliderImage, sliderTitle, sliderDesc, id]
    );

    res.status(200).json({
      success: true,
      data: {
        id: parseInt(id),
        sliderImage: finalSliderImage,
        sliderTitle,
        sliderDesc
      }
    });
  } catch (error) {
    console.error('Error updating slider:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

module.exports = updateSlider;
