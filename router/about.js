const express = require('express');
const router = express.Router();
const { aboutUpload } = require('../services/multer');

const getAbout = require('../controller/about/getAbout');
const postAbout = require('../controller/about/postAbout');

// Routes
router.get('/', getAbout);
router.put('/', aboutUpload.fields([
  { name: 'headerImage', maxCount: 1 },
  { name: 'storyImage', maxCount: 1 }
]), postAbout);

module.exports = router;