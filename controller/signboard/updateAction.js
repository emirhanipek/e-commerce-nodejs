const connection = require('../../services/mysql');

async function updateSignboardAction(req, res) {
  const { id } = req.params;
  const { is_actions, total_price } = req.body;

  // Validasyon
  if (is_actions === undefined && total_price === undefined) {
    return res.status(400).json({
      success: false,
      message: 'is_actions veya total_price parametrelerinden en az biri gereklidir.'
    });
  }

  try {
    // Önce signboard'un var olup olmadığını kontrol et
    const [existingSignboard] = await connection.promise().query(
      'SELECT id FROM signboard WHERE id = ?',
      [id]
    );

    if (existingSignboard.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tabela bulunamadı.'
      });
    }

    // Güncelleme sorgusu oluştur
    let updateQuery = 'UPDATE signboard SET ';
    const updateParams = [];
    const updateFields = [];

    if (is_actions !== undefined) {
      updateFields.push('is_actions = ?');
      updateParams.push(is_actions ? 1 : 0);
    }

    if (total_price !== undefined) {
      updateFields.push('total_price = ?');
      updateParams.push(total_price);
    }

    updateQuery += updateFields.join(', ') + ' WHERE id = ?';
    updateParams.push(id);

    await connection.promise().query(updateQuery, updateParams);

    // Güncellenmiş veriyi getir
    const [updatedSignboard] = await connection.promise().query(
      'SELECT id, is_actions, total_price FROM signboard WHERE id = ?',
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'Tabela başarıyla güncellendi',
      data: updatedSignboard[0]
    });
  } catch (error) {
    console.error('Error updating signboard action:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

module.exports = updateSignboardAction;
