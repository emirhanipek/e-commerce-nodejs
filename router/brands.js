const createBrands = require('../controller/brands/createBrands');
const deleteBrands = require('../controller/brands/deleteBrands');
const getBrands = require('../controller/brands/getBrands');
const updateBrands = require('../controller/brands/updateBrands');

const express = require('express');
const router = express.Router();


// Routes
router.post('/', createBrands);
router.get('/', getBrands);
router.put('/:id', updateBrands);
router.delete('/:id', deleteBrands);

module.exports = router;