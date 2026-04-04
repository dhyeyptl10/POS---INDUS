const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
});

// Middleware
app.use(cors());
app.use(express.json());

// Socket.IO context for controllers
app.set('io', io);

// Basic Route
app.get('/', (req, res) => {
    res.send('Restaurant POS API is running...');
});

// Routes will be added here
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/tables', require('./routes/table.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/reports', require('./routes/report.routes'));
app.use('/api/payment', require('./routes/payment.routes'));

// Socket.IO Connection Handler
const socketHandler = require('./sockets/socket.handler');
socketHandler(io);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
