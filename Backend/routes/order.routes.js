const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrders,
    sendToKitchen,
    updateOrderStatus,
    addItemsToOrder
} = require('../controllers/order.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/')
    .get(protect, getOrders)
    .post(protect, createOrder);

router.post('/:id/send', protect, sendToKitchen);
router.put('/:id/status', protect, updateOrderStatus);
router.put('/:id/add-items', protect, addItemsToOrder);

module.exports = router;
