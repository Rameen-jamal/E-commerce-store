const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
} = require('../controllers/OrderController');
const { protect, admin } = require('../middleware/authMiddleware');

// IMPORTANT: Specific routes PEHLE, dynamic routes BAAD MEIN
router.post('/', protect, createOrder);                          // POST /api/orders
router.get('/myorders', protect, getMyOrders);                   // GET /api/orders/myorders
router.get('/', protect, admin, getAllOrders);                    // GET /api/orders (admin)
router.get('/:id', protect, getOrderById);                       // GET /api/orders/:id
router.put('/:id/status', protect, admin, updateOrderStatus);    // PUT /api/orders/:id/status

module.exports = router;