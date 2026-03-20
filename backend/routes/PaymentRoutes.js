const express = require('express');
const router = express.Router();
const { createPaymentIntent } = require('../controllers/PaymentController');
const { protect } = require('../middleware/authmiddleware');

router.post('/create-payment-intent', protect, createPaymentIntent);

module.exports = router;