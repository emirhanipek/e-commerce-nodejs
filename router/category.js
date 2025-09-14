const express = require('express');
const router = express.Router();


const getAllCategories = require('../controller/category.js/getAllCategories');
const getCategoryById = require('../controller/category.js/getCategoryById');
const createCategory = require('../controller/category.js/createCategory');
const updateCategory = require('../controller/category.js/updateCategory');
const deleteCategory = require('../controller/category.js/deleteCategory');

// Routes
router.get('/', getAllCategories);           // GET /category/ → tüm kategoriler
router.get('/:id', getCategoryById);        // GET /category/:id → tek kategori
router.post('/', createCategory);           // POST /category/ → yeni kategori ekle
router.put('/:id', updateCategory);         // PUT /category/:id → kategori güncelle
router.delete('/:id', deleteCategory);      // DELETE /category/:id → kategori sil

module.exports = router;