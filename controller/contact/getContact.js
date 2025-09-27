const connection = require('../../services/mysql');

async function getContact(req, res) {
  try {
    const [rows] = await connection.promise().query('SELECT * FROM contact');
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = getContact;