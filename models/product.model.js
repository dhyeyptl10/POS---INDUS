const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a product name'],
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
    },
    variants: [
        {
            name: { type: String },
            price: { type: Number },
        },
    ],
    tax: {
        type: Number,
        default: 0,
    },
    sendToKitchen: {
        type: Boolean,
        default: false,
    },
    image: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
