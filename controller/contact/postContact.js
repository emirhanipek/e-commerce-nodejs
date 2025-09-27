const connection = require('../../services/mysql');

async function postContact(req, res) {
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
      `INSERT INTO contact (headerImage, headerTitle, headerDesc, phoneTitle, phoneValue, emailTitle, emailValue, addressTitle, addressValue, workhoursTitle, workHoursDesc, facebookLink, instaLink, linkedinLink)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [headerImage, headerTitle, headerDesc, phoneTitle, phoneValue, emailTitle, emailValue, addressTitle, addressValue, workhoursTitle, workHoursDesc, facebookLink || null, instaLink || null, linkedinLink || null]
    );

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
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
    console.error('Error creating contact:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = postContact;