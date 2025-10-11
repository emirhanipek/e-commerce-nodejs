const express = require('express');
const router = express.Router();
const { sliderUpload } = require('../services/multer');

// Controller fonksiyonlarını import et
const getAllSliders = require('../controller/slider/getAllSliders');
const getSliderById = require('../controller/slider/getSliderById');
const createSlider = require('../controller/slider/createSlider');
const updateSlider = require('../controller/slider/updateSlider');
const deleteSlider = require('../controller/slider/deleteSlider');

// Routes
router.get('/', getAllSliders);                 // GET /slider/ → tüm slider'lar
router.get('/:id', getSliderById);             // GET /slider/:id → tek slider
router.post('/', sliderUpload.single('sliderImage'), createSlider);  // POST /slider/ → yeni slider ekle
router.put('/:id', sliderUpload.single('sliderImage'), updateSlider); // PUT /slider/:id → slider güncelle
router.delete('/:id', deleteSlider);           // DELETE /slider/:id → slider sil

module.exports = router;
