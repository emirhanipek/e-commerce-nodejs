const connection = require('../../services/mysql');

async function updateAbout(req, res) {
  const {
    headerText,
    headerDescription,
    storyTitle,
    storyDesc,
    misyonTitle,
    misyonDescription,
    visyonTitle,
    vizyonDescription
  } = req.body;

  // Multer'dan gelen dosyalar: req.files.headerImage[0] ve req.files.storyImage[0]
  const headerImage = req.files?.headerImage?.[0]?.path || null;
  const storyImage = req.files?.storyImage?.[0]?.path || null;

  if (!headerText || !headerDescription || !storyTitle || !storyDesc || !misyonTitle || !misyonDescription || !visyonTitle || !vizyonDescription) {
    return res.status(400).json({ success: false, message: 'Tüm alanlar zorunludur.' });
  }

  try {
    // Önce mevcut kaydı alalım (resimler opsiyonel güncellenecek)
    const [existing] = await connection.promise().query(`SELECT * FROM about LIMIT 1`);

    const finalHeaderImage = headerImage || (existing[0]?.headerImage || null);
    const finalStoryImage = storyImage || (existing[0]?.storyImage || null);

    const [result] = await connection.promise().query(
      `UPDATE about SET headerImage = ?, headerText = ?, headerDescription = ?, storyTitle = ?, storyImage = ?, storyDesc = ?, misyonTitle = ?, misyonDescription = ?, visyonTitle = ?, vizyonDescription = ?`,
      [finalHeaderImage, headerText, headerDescription, storyTitle, finalStoryImage, storyDesc, misyonTitle, misyonDescription, visyonTitle, vizyonDescription]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Kayıt bulunamadı.' });
    }

    res.status(200).json({
      success: true,
      data: {
        headerImage: finalHeaderImage,
        headerText,
        headerDescription,
        storyTitle,
        storyImage: finalStoryImage,
        storyDesc,
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