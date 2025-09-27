const express = require('express');
const router = express.Router();

const getAbout = require('../controller/about/getAbout');
const postAbout = require('../controller/about/postAbout');

// Routes
router.get('/', getAbout);           // GET /about/ ’ about bilgilerini getir
router.post('/', postAbout);         // POST /about/ ’ yeni about bilgisi ekle

module.exports = router;