const connection = require('../../db/mysql');

async function createCategory(req, res) {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    const [result] = await connection.promise().query(
      'INSERT INTO category (name) VALUES (?)',
      [name]
    );

    res.status(201).json({ success: true, message: 'Category created', id: result.insertId });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = createCategory;
