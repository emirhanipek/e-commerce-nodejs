const connection = require('../../services/mysql');

async function postAbout(req, res) {
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
      `INSERT INTO about (headerImage, headerText, headerDescription, storyTitle, storyImage, misyonTitle, misyonDescription, visyonTitle, vizyonDescription)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [headerImage, headerText, headerDescription, storyTitle, storyImage, misyonTitle, misyonDescription, visyonTitle, vizyonDescription]
    );

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
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
    console.error('Error creating about:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = postAbout;