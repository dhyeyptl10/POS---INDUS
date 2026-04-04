const Order = require('../models/order.model');
const Table = require('../models/table.model');

// @desc    Create a new order for a table
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { tableId, items } = req.body;

        const table = await Table.findById(tableId);

        if (!table) {
            return res.status(404).json({ success: false, message: 'Table not found' });
        }

        // Generate Order Number
        const orderCount = await Order.countDocuments();
        const orderNumber = `ORD-${Date.now().toString().slice(-4)}-${orderCount + 1}`;

        const order = new Order({
            tableId,
            userId: req.user._id,
            items,
            orderNumber,
        });

        // Set table as occupied
        table.status = 'occupied';
        await table.save();

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('tableId', 'tableNumber')
            .populate('userId', 'name')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Send order to kitchen
// @route   POST /api/orders/:id/send
// @access  Private
const sendToKitchen = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.status = 'sent_to_kitchen';
        const updatedOrder = await order.save();

        // Emit real-time event to kitchen
        const io = req.app.get('io');
        io.to('kitchen').emit('new_order', updatedOrder);

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update order status (kitchen flow)
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.status = status;
        const updatedOrder = await order.save();

        // Emit real-time event to specific table and kitchen
        const io = req.app.get('io');
        io.emit('order_status_updated', updatedOrder);

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add items to existing order
// @route   PUT /api/orders/:id/add-items
// @access  Private
const addItemsToOrder = async (req, res) => {
  try {
      const { items } = req.body;
      const order = await Order.findById(req.params.id);

      if (!order) {
          return res.status(404).json({ success: false, message: 'Order not found' });
      }

      // Add new items
      order.items.push(...items);
      
      const updatedOrder = await order.save();
      res.json(updatedOrder);
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
    createOrder,
    getOrders,
    sendToKitchen,
    updateOrderStatus,
    addItemsToOrder
};
