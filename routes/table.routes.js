const express = require('express');
const router = express.Router();
const { getTables, createTable } = require('../controllers/table.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.route('/')
    .get(protect, getTables)
    .post(protect, authorize('admin'), createTable);

module.exports = router;
