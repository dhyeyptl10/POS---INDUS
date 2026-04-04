const Order = require('../models/order.model');
const Product = require('../models/product.model');

// @desc    Get dashboard statistics
// @route   GET /api/reports/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Total sales today
        const salesToday = await Order.aggregate([
            { $match: { createdAt: { $gte: today }, paymentStatus: 'paid' } },
            { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } },
        ]);

        // 2. Total orders
        const totalOrders = await Order.countDocuments({ createdAt: { $gte: today } });

        // 3. Orders grouped by status
        const ordersByStatus = await Order.aggregate([
            { $match: { createdAt: { $gte: today } } },
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);

        // 4. Top 3 selling products
        const topProducts = await Order.aggregate([
            { $unwind: '$items' },
            { $group: { _id: '$items.productId', name: { $first: '$items.name' }, totalQuantity: { $sum: '$items.quantity' } } },
            { $sort: { totalQuantity: -1 } },
            { $limit: 3 },
        ]);

        res.json({
            success: true,
            stats: {
                totalSales: salesToday[0] ? salesToday[0].totalSales : 0,
                totalOrders,
                ordersByStatus,
                topProducts,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get sales report (all sales)
// @route   GET /api/reports/sales
// @access  Private/Admin
const getSalesReport = async (req, res) => {
    try {
        const sales = await Order.find({ paymentStatus: 'paid' })
            .populate('tableId', 'tableNumber')
            .populate('userId', 'name')
            .sort({ createdAt: -1 });

        res.json(sales);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getDashboardStats, getSalesReport };
