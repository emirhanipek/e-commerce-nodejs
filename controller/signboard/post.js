const connection = require('../../services/mysql');

async function createSignboard(req, res) {
  const {
    signboard_text,
    font_family,
    font_size,
    lighting_type,
    letter_material,
    letter_height,
    background_type,
    background_color,
    width,
    height,
    customer_name,
    customer_phone,
    customer_email
  } = req.body;

  // Validasyon
  if (!signboard_text || !font_family || !font_size || !lighting_type || !letter_material ||
      !letter_height || !background_type || !background_color || !width || !height ||
      !customer_name || !customer_phone || !customer_email) {
    return res.status(400).json({
      success: false,
      message: 'Tüm alanlar zorunludur.'
    });
  }

  try {
    const [result] = await connection.promise().query(
      `INSERT INTO signboard
        (signboard_text, font_family, font_size, lighting_type, letter_material,
         letter_height, background_type, background_color, width, height,
         username, user_email, user_phone)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [signboard_text, font_family, font_size, lighting_type, letter_material,
       letter_height, background_type, background_color, width, height,
       customer_name, customer_email, customer_phone]
    );

    res.status(201).json({
      success: true,
      message: 'Tabela başarıyla oluşturuldu',
      data: {
        id: result.insertId,
        signboard_text,
        font_family,
        font_size,
        lighting_type,
        letter_material,
        letter_height,
        background_type,
        background_color,
        width,
        height,
        customer_name,
        customer_email,
        customer_phone
      }
    });
  } catch (error) {
    console.error('Error creating signboard:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

module.exports = createSignboard;
