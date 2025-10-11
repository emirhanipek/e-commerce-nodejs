const connection = require('../../services/mysql');

async function getSliderById(req, res) {
  const { id } = req.params;

  try {
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

    res.status(200).json({
      success: true,
      data: slider[0]
    });
  } catch (error) {
    console.error('Error fetching slider:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

module.exports = getSliderById;
