const Product = require('../models/product.model');

// @desc    Get all products
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res) => {
    const products = await Product.find({});
    res.json(products);
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    const { name, category, price, variants, tax, sendToKitchen, image } = req.body;

    const product = new Product({
        name,
        category,
        price,
        variants,
        tax,
        sendToKitchen,
        image,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
};

module.exports = { getProducts, createProduct };
