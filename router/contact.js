const express = require('express');
const router = express.Router();

const getContact = require('../controller/contact/getContact');
const updateContact = require('../controller/contact/postContact');

// Routes
router.get('/', getContact);           // GET /contact/ � contact bilgilerini getir
router.put('/',updateContact );         // POST /contact/ � yeni contact bilgisi ekle

module.exports = router;