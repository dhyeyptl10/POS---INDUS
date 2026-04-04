const express = require('express');
const router = express.Router();
const { getProducts, createProduct } = require('../controllers/product.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.route('/')
    .get(protect, getProducts)
    .post(protect, authorize('admin'), createProduct);

module.exports = router;
