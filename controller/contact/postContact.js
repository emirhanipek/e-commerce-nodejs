const connection = require('../../services/mysql');

async function updateContact(req, res) {
  const {
    headerImage,
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

  if (!headerImage || !headerTitle || !headerDesc || !phoneTitle || !phoneValue || !emailTitle || !emailValue || !addressTitle || !addressValue || !workhoursTitle || !workHoursDesc) {
    return res.status(400).json({ success: false, message: 'Zorunlu alanlar eksik.' });
  }

  try {
    const [result] = await connection.promise().query(
      `UPDATE contact SET headerImage = ?, headerTitle = ?, headerDesc = ?, phoneTitle = ?, phoneValue = ?, emailTitle = ?, emailValue = ?, addressTitle = ?, addressValue = ?, workhoursTitle = ?, workHoursDesc = ?, facebookLink = ?, instaLink = ?, linkedinLink = ?`,
      [headerImage, headerTitle, headerDesc, phoneTitle, phoneValue, emailTitle, emailValue, addressTitle, addressValue, workhoursTitle, workHoursDesc, facebookLink || null, instaLink || null, linkedinLink || null]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Kayıt bulunamadı.' });
    }

    res.status(200).json({
      success: true,
      data: {
        headerImage,
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