const Table = require('../models/table.model');

// @desc    Get all tables
// @route   GET /api/tables
// @access  Private
const getTables = async (req, res) => {
    const tables = await Table.find({});
    res.json(tables);
};

// @desc    Create a table
// @route   POST /api/tables
// @access  Private/Admin
const createTable = async (req, res) => {
    const { tableNumber, seats } = req.body;

    const tableExists = await Table.findOne({ tableNumber });

    if (tableExists) {
        return res.status(400).json({ success: false, message: 'Table already exists' });
    }

    const table = await Table.create({
        tableNumber,
        seats,
    });

    res.status(201).json(table);
};

module.exports = { getTables, createTable };
