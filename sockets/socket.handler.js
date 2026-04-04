const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log(`New client connected: ${socket.id}`);

        // Join specific room for a table
        socket.on('join_table', (tableId) => {
            socket.join(`table_${tableId}`);
            console.log(`Socket ${socket.id} joined table_${tableId}`);
        });

        // Join kitchen room
        socket.on('join_kitchen', () => {
            socket.join('kitchen');
            console.log(`Socket ${socket.id} joined kitchen`);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};

module.exports = socketHandler;
