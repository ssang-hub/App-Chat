import userModel from '@models/userModel';
import { v4 as uuidv4 } from 'uuid';
const videoChat = (socket) => {
    socket.on('create-video-chat', async (msg) => {
        try {
            const roomId = uuidv4();
            const Callfrom = await userModel.findOne({ _id: msg.from }, { fullName: 1, avatar: 1 });
            const CallTo = onlineUsers.get(msg.to);
            socket.join(roomId);
            socket.to(onlineUsers.get(msg.from)).emit('created-video-chat-room', { roomId });
            socket.to(CallTo).emit('receive-video-call', { Callfrom, roomId });
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('accept-video-call', (AccountCall) => {
        socket.to(AccountCall.data.roomId).emit('accept-call-from-receiver', { accept: true });
    });
    socket.on('refuse-video-call', (AccountCall) => {
        socket.to(AccountCall.data.roomId).emit('refused-call-from-receiver', { refused: true });
    });
    socket.on('leave-video-call', (IdAccountCall) => {
        socket.leave();
    });
};
export default videoChat;
