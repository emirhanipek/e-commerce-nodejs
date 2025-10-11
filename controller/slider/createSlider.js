const connection = require('../../services/mysql');

async function createSlider(req, res) {
  const { sliderTitle, sliderDesc } = req.body;

  // Multer'dan gelen dosya: req.file
  const sliderImage = req.file?.path || null;

  if (!sliderImage || !sliderTitle || !sliderDesc) {
    return res.status(400).json({
      success: false,
      message: 'sliderImage, sliderTitle ve sliderDesc zorunludur.'
    });
  }

  try {
    const [result] = await connection.promise().query(
      'INSERT INTO sliders (sliderImage, sliderTitle, sliderDesc) VALUES (?, ?, ?)',
      [sliderImage, sliderTitle, sliderDesc]
    );

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        sliderImage,
        sliderTitle,
        sliderDesc
      }
    });
  } catch (error) {
    console.error('Error creating slider:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

module.exports = createSlider;
