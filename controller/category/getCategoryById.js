const connection = require('../../db');

async function getCategoryById(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await connection.promise().query(
      'SELECT * FROM category WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = getCategoryById;
