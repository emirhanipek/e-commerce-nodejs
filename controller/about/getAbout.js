const connection = require('../../services/mysql');

async function getAbout(req, res) {
  try {
    const [rows] = await connection.promise().query('SELECT * FROM about');
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching about:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = getAbout;