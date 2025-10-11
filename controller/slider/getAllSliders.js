const connection = require('../../services/mysql');

async function getAllSliders(req, res) {
  try {
    const [sliders] = await connection.promise().query(
      'SELECT * FROM sliders ORDER BY created_at DESC'
    );

    res.status(200).json({
      success: true,
      data: sliders
    });
  } catch (error) {
    console.error('Error fetching sliders:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

module.exports = getAllSliders;
