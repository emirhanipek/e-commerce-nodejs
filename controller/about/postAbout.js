const connection = require('../../services/mysql');

async function updateAbout(req, res) {
  const {
    headerImage,
    headerText,
    headerDescription,
    storyTitle,
    storyImage,
    misyonTitle,
    misyonDescription,
    visyonTitle,
    vizyonDescription
  } = req.body;

  if (!headerImage || !headerText || !headerDescription || !storyTitle || !storyImage || !misyonTitle || !misyonDescription || !visyonTitle || !vizyonDescription) {
    return res.status(400).json({ success: false, message: 'Tüm alanlar zorunludur.' });
  }

  try {
    const [result] = await connection.promise().query(
      `UPDATE about SET headerImage = ?, headerText = ?, headerDescription = ?, storyTitle = ?, storyImage = ?, misyonTitle = ?, misyonDescription = ?, visyonTitle = ?, vizyonDescription = ?`,
      [headerImage, headerText, headerDescription, storyTitle, storyImage, misyonTitle, misyonDescription, visyonTitle, vizyonDescription]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Kayıt bulunamadı.' });
    }

    res.status(200).json({
      success: true,
      data: {
        headerImage,
        headerText,
        headerDescription,
        storyTitle,
        storyImage,
        misyonTitle,
        misyonDescription,
        visyonTitle,
        vizyonDescription
      }
    });
  } catch (error) {
    console.error('Error updating about:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = updateAbout;