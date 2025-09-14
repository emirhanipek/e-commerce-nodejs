const express = require('express');
const router = express.Router();
const upload = require('../services/multer'); // Multer servisi

// Controller fonksiyonlarını import et
const getAllProducts = require('../controller/product/getAllProducts');
const getProductById = require('../controller/product/getProductById');
const createProduct = require('../controller/product/createProduct');
const updateProduct = require('../controller/product/updateProduct');
const deleteProduct = require('../controller/product/deleteProduct');

// Routes
router.get('/', getAllProducts);                 // GET /product/ → tüm ürünler
router.get('/:id', getProductById);             // GET /product/:id → tek ürün
router.post('/', upload.array('images', 10), createProduct);  // POST /product/ → yeni ürün ekle, max 10 görsel
router.put('/:id', upload.array('images', 10), updateProduct); // PUT /product/:id → ürün güncelle, max 10 görsel
router.delete('/:id', deleteProduct);           // DELETE /product/:id → ürün sil

module.exports = router;
