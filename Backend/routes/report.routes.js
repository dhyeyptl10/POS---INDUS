const express = require('express');
const router = express.Router();
const { getDashboardStats, getSalesReport } = require('../controllers/report.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/dashboard', protect, authorize('admin'), getDashboardStats);
router.get('/sales', protect, authorize('admin'), getSalesReport);

module.exports = router;
