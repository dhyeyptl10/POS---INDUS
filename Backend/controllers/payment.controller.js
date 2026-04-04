const Order = require('../models/order.model');
const Table = require('../models/table.model');
const { generateUPIQRCode } = require('../services/qr.service');

// @desc    Generate UPI QR code for order payment
// @route   POST /api/payment/:orderId
// @access  Private
const generateQR = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const qrImage = await generateUPIQRCode(order.totalAmount, order.orderNumber);

        res.json({
            success: true,
            qrImage,
            orderNumber: order.orderNumber,
            amount: order.totalAmount,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Confirm payment manually
// @route   POST /api/payment/:orderId/confirm
// @access  Private
const confirmPayment = async (req, res) => {
    try {
        const { paymentMethod, totalAmount } = req.body;
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.paymentStatus = 'paid';
        order.paymentMethod = paymentMethod || 'cash';
        order.status = 'completed';
        const updatedOrder = await order.save();

        // Mark table as available
        const table = await Table.findById(order.tableId);
        if (table) {
            table.status = 'available';
            await table.save();
        }

        // Emit payment event
        const io = req.app.get('io');
        io.emit('payment_done', updatedOrder);

        res.json({
            success: true,
            message: 'Payment confirmed and table cleared',
            order: updatedOrder,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { generateQR, confirmPayment };
