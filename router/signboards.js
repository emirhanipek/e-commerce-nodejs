const express = require('express');
const router = express.Router();

const getSignboards = require('../controller/signboard/get');
const createSignboard = require('../controller/signboard/post');
const updateSignboardAction = require('../controller/signboard/updateAction');
const {
  createLightType,
  getAllLightTypes,
  updateLightType,
  deleteLightType } = require('../controller/signboard/basicRoot/light_types');
const {
    createFrontMaterial,
  getAllFrontMaterials,
  updateFrontMaterial,
  deleteFrontMaterial } = require('../controller/signboard/basicRoot/front_materials');

const {
      createLetterHeight,
  getAllLetterHeights,
  updateLetterHeight,
  deleteLetterHeight } = require('../controller/signboard/basicRoot/letter_heights');

const {
        createBackgroundColor,
    getAllBackgroundColors,
    updateBackgroundColor, 
    deleteBackgroundColor } = require('../controller/signboard/basicRoot/background_colors');

// GET all signboards
router.get('/', getSignboards);

// POST create new signboard
router.post('/', createSignboard);

// PATCH update signboard action and total price
router.patch('/:id/action', updateSignboardAction);

// Işık türleri için CRUD işlemleri
router.get('/light_types', getAllLightTypes);
router.put('/light_types/:id', updateLightType);
router.delete('/light_types/:id', deleteLightType);
router.post('/light_types', createLightType)

// Ön yüz malzemeleri için CRUD işlemleri
router.get('/front_materials', getAllFrontMaterials);
router.put('/front_materials/:id', updateFrontMaterial);
router.delete('/front_materials/:id', deleteFrontMaterial);
router.post('/front_materials', createFrontMaterial) 

// Harf yükseklikleri için CRUD işlemleri
router.get('/letter_heights', getAllLetterHeights);
router.put('/letter_heights/:id', updateLetterHeight);
router.delete('/letter_heights/:id', deleteLetterHeight);
router.post('/letter_heights', createLetterHeight)

// Arka plan renkleri için CRUD işlemleri
router.get('/background_colors', getAllBackgroundColors);
router.put('/background_colors/:id', updateBackgroundColor);
router.delete('/background_colors/:id', deleteBackgroundColor);
router.post('/background_colors', createBackgroundColor)


module.exports = router;
