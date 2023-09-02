const Typing = (socket) => {
    socket.on('on-typing', async (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('on-typing-receiver', data);
        }
    });
    socket.on('off-typing', async (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('off-typing-receiver', data);
        }
    });
};
export default Typing;
