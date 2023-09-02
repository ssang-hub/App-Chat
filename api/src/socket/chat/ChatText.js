import * as messageService from '@services/messageService';
const chatText = (socket) => {
    socket.on('send-msg', async (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        const senderId = onlineUsers.get(data.from);
        const msg = await messageService.addMessage(data);
        if (sendUserSocket) {
            const messageEmit = data.userGroup ? { ...msg, userGroup: data.userGroup } : msg;
            socket.to(sendUserSocket).except(senderId).emit('msg-recieve', messageEmit);
        }
    });
    socket.on('send-sticker', async (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        const senderId = onlineUsers.get(data.from);
        const { content, ...newMessage } = data;
        newMessage.message = { type: 'sticker', content: content };
        const msg = await messageService.addMessage(newMessage);
        if (sendUserSocket) {
            const messageEmit = data.userGroup ? { ...msg, userGroup: data.userGroup } : msg;
            socket.to(sendUserSocket).except(senderId).emit('sticker-receive', messageEmit);
        }
    });
};
export default chatText;
