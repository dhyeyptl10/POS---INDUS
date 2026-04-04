const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const Table = require('../models/table.model');

dotenv.config();

const users = [
    {
        name: 'Admin User',
        email: 'admin@cafe.com',
        password: 'password123',
        role: 'admin',
    },
    {
        name: 'Staff User',
        email: 'staff@cafe.com',
        password: 'password123',
        role: 'staff',
    },
];

const products = [
    {
        name: 'Cappuccino',
        category: 'Beverage',
        price: 180,
        tax: 5,
        sendToKitchen: true,
    },
    {
        name: 'Club Sandwich',
        category: 'Food',
        price: 250,
        tax: 5,
        sendToKitchen: true,
    },
    {
        name: 'French Fries',
        category: 'Snacks',
        price: 120,
        tax: 5,
        sendToKitchen: true,
    },
    {
        name: 'Pasta Carbonara',
        category: 'Food',
        price: 350,
        tax: 5,
        sendToKitchen: true,
    },
    {
        name: 'Coke',
        category: 'Beverage',
        price: 60,
        tax: 12,
        sendToKitchen: false,
    },
];

const tables = [
    { tableNumber: '1', seats: 2 },
    { tableNumber: '2', seats: 4 },
    { tableNumber: '3', seats: 4 },
    { tableNumber: '4', seats: 6 },
    { tableNumber: '5', seats: 2 },
];

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        await User.deleteMany();
        await Product.deleteMany();
        await Table.deleteMany();

        await User.create(users);
        await Product.create(products);
        await Table.create(tables);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
