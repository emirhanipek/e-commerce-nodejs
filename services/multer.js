const multer = require('multer');
const path = require('path');

// Dosyaların kaydedileceği klasör ve isimlendirme
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // uploads klasörüne kaydedilecek
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Dosya filter (sadece image)
const fileFilter = (req, file, cb) => {
  if(file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Sadece görsel yüklenebilir'), false);
  }
};

// Multer setup
const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // max 15MB
  fileFilter: fileFilter
});

module.exports = upload;
