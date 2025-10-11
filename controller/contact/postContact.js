const connection = require('../../services/mysql');

async function updateContact(req, res) {
  const {
    headerTitle,
    headerDesc,
    phoneTitle,
    phoneValue,
    emailTitle,
    emailValue,
    addressTitle,
    addressValue,
    workhoursTitle,
    workHoursDesc,
    facebookLink,
    instaLink,
    linkedinLink
  } = req.body;

  // Multer'dan gelen dosya: req.file
  const headerImage = req.file?.path || null;

  if (!headerTitle || !headerDesc || !phoneTitle || !phoneValue || !emailTitle || !emailValue || !addressTitle || !addressValue || !workhoursTitle || !workHoursDesc) {
    return res.status(400).json({ success: false, message: 'Zorunlu alanlar eksik.' });
  }

  try {
    // Önce mevcut kaydı alalım (resim opsiyonel güncellenecek)
    const [existing] = await connection.promise().query(`SELECT * FROM contact LIMIT 1`);

    const finalHeaderImage = headerImage || (existing[0]?.headerImage || null);

    const [result] = await connection.promise().query(
      `UPDATE contact SET headerImage = ?, headerTitle = ?, headerDesc = ?, phoneTitle = ?, phoneValue = ?, emailTitle = ?, emailValue = ?, addressTitle = ?, addressValue = ?, workhoursTitle = ?, workHoursDesc = ?, facebookLink = ?, instaLink = ?, linkedinLink = ?`,
      [finalHeaderImage, headerTitle, headerDesc, phoneTitle, phoneValue, emailTitle, emailValue, addressTitle, addressValue, workhoursTitle, workHoursDesc, facebookLink || null, instaLink || null, linkedinLink || null]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Kayıt bulunamadı.' });
    }

    res.status(200).json({
      success: true,
      data: {
        headerImage: finalHeaderImage,
        headerTitle,
        headerDesc,
        phoneTitle,
        phoneValue,
        emailTitle,
        emailValue,
        addressTitle,
        addressValue,
        workhoursTitle,
        workHoursDesc,
        facebookLink,
        instaLink,
        linkedinLink
      }
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = updateContact;