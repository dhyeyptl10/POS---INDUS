const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    tableNumber: {
        type: String,
        required: [true, 'Please provide a table number'],
        unique: true,
    },
    seats: {
        type: Number,
        required: [true, 'Please provide seat count'],
        default: 4,
    },
    status: {
        type: String,
        enum: ['available', 'occupied', 'reserved'],
        default: 'available',
    },
}, { timestamps: true });

module.exports = mongoose.model('Table', tableSchema);
