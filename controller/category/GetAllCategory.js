const connection = require('../../db/mysql');

async function getAllCategories(req, res) {
  try {
    const [rows] = await connection.promise().query('SELECT * FROM category');
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = getAllCategories;
