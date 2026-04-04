const express = require('express');
const router = express.Router();
const { generateQR, confirmPayment } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/:orderId', protect, generateQR);
router.post('/:orderId/confirm', protect, confirmPayment);

module.exports = router;
