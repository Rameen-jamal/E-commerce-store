const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/ProductController');
const { protect, admin } = require('../middleware/authmiddleware');

// Public routes
router.get('/', getProducts);           // GET /api/products
router.get('/:id', getProductById);     // GET /api/products/123

// Admin only routes
router.post('/', protect, admin, createProduct);          // POST /api/products
router.put('/:id', protect, admin, updateProduct);        // PUT /api/products/123
router.delete('/:id', protect, admin, deleteProduct);     // DELETE /api/products/123

module.exports = router;