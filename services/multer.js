const multer = require('multer');
const path = require('path');

// Product için storage
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/product'); // uploads/product klasörüne kaydedilecek
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// About için storage
const aboutStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/about'); // uploads/about klasörüne kaydedilecek
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Contact için storage
const contactStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/contact'); // uploads/contact klasörüne kaydedilecek
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Slider için storage
const sliderStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/slider'); // uploads/slider klasörüne kaydedilecek
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

// Product upload setup
const productUpload = multer({
  storage: productStorage,
  limits: { fileSize: 15 * 1024 * 1024 }, // max 15MB
  fileFilter: fileFilter
});

// About upload setup (2 resim: headerImage ve storyImage)
const aboutUpload = multer({
  storage: aboutStorage,
  limits: { fileSize: 15 * 1024 * 1024 }, // max 15MB
  fileFilter: fileFilter
});

// Contact upload setup (1 resim: headerImage)
const contactUpload = multer({
  storage: contactStorage,
  limits: { fileSize: 15 * 1024 * 1024 }, // max 15MB
  fileFilter: fileFilter
});

// Slider upload setup (1 resim: sliderImage)
const sliderUpload = multer({
  storage: sliderStorage,
  limits: { fileSize: 15 * 1024 * 1024 }, // max 15MB
  fileFilter: fileFilter
});

module.exports = {
  productUpload,
  aboutUpload,
  contactUpload,
  sliderUpload
};
