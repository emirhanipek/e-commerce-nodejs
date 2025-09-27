const express = require('express');
const router = express.Router();

const getContact = require('../controller/contact/getContact');
const postContact = require('../controller/contact/postContact');

// Routes
router.get('/', getContact);           // GET /contact/ ’ contact bilgilerini getir
router.post('/', postContact);         // POST /contact/ ’ yeni contact bilgisi ekle

module.exports = router;