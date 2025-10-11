const connection = require('../../services/mysql');

async function getSignboards(req, res) {
  try {
    const [rows] = await connection.promise().query(
      'SELECT * FROM signboard ORDER BY created_at DESC'
    );

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching signboards:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

module.exports = getSignboards;
