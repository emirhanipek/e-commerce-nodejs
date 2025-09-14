const express = require('express');
const router = express.Router();

// Controller fonksiyonlarını import et
const getAllProducts = require('../controller/product.js/getAllProducts');
const getProductById = require('../controller/product.js/getProductById');
const createProduct = require('../controller/product.js/createProduct');
const updateProduct = require('../controller/product.js/updateProduct');
const deleteProduct = require('../controller/product.js/deleteProduct');

// Routes
router.get('/', getAllProducts);           // GET /product/ → tüm ürünler
router.get('/:id', getProductById);        // GET /product/:id → tek ürün
router.post('/', createProduct);           // POST /product/ → yeni ürün ekle
router.put('/:id', updateProduct);         // PUT /product/:id → ürün güncelle
router.delete('/:id', deleteProduct);      // DELETE /product/:id → ürün sil

module.exports = router;
