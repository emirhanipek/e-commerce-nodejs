const connection = require('../../db');

async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const [result] = await connection.promise().query(
      'UPDATE category SET name = ? WHERE id = ?',
      [name, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({ success: true, message: 'Category updated' });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = updateCategory;
