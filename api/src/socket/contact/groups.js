import * as ContactService from '@services/ContactService';

const groupSocketService = (socket) => {
    socket.on('group-created', async (msg) => {
        try {
            console.log(msg);
        } catch (error) {
            console.log(error);
        }
    });
    socket.on('add-users-to-group', async (msg) => {});
    socket.on('leave-group', async (msg) => {});
};
export default groupSocketService;
