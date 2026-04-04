const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
    notes: { type: String },
});

const orderSchema = new mongoose.Schema({
    tableId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [orderItemSchema],
    status: {
        type: String,
        enum: ['created', 'sent_to_kitchen', 'preparing', 'completed', 'cancelled'],
        default: 'created',
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending',
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'digital', 'upi'],
    },
    totalAmount: {
        type: Number,
        default: 0,
    },
    orderNumber: {
        type: String,
        unique: true,
    },
}, { timestamps: true });

// Pre-save to calculate totalAmount if needed
orderSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    this.totalAmount = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
