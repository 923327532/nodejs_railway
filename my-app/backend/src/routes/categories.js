const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Rutas publicas
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.get('/:categoryId/products', categoryController.getProductsByCategory);

// Rutas protegidas (solo ADMIN)
router.post('/', authenticate, authorizeAdmin, categoryController.createCategory);
router.put('/:id', authenticate, authorizeAdmin, categoryController.updateCategory);
router.delete('/:id', authenticate, authorizeAdmin, categoryController.deleteCategory);

module.exports = router;
