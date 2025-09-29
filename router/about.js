const express = require('express');
const router = express.Router();

const getAbout = require('../controller/about/getAbout');
const postAbout = require('../controller/about/postAbout');

// Routes
router.get('/', getAbout);          
router.put('/', postAbout);       

module.exports = router;