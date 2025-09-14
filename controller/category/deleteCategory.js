const connection = require('../../services/mysql');

async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    const [result] = await connection.promise().query(
      'DELETE FROM category WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = deleteCategory;
