const express = require('express');
const router = express.Router();
const { contactUpload } = require('../services/multer');

const getContact = require('../controller/contact/getContact');
const updateContact = require('../controller/contact/postContact');

// Routes
router.get('/', getContact);           // GET /contact/ → contact bilgilerini getir
router.put('/', contactUpload.single('headerImage'), updateContact); // PUT /contact/ → contact bilgisi güncelle

module.exports = router;