const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Rutas publicas (GET)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Rutas protegidas (solo ADMIN)
router.post('/', authenticate, authorizeAdmin, productController.createProduct);
router.put('/:id', authenticate, authorizeAdmin, productController.updateProduct);
router.delete('/:id', authenticate, authorizeAdmin, productController.deleteProduct);

module.exports = router;
