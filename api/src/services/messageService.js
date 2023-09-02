import messageModel from '@models/messageModel';
import ContactsModel from '@models/ContactModel';
const addMessage = async (msg) => {
    try {
        const { __v, deleteAt, ...result } = await messageModel.createMessage(msg);
        const date = new Date(result.createdAt);

        const message = {
            _id: result._id,
            from: result.senderId,
            to: result.receiverId,
            message: result.message,
            lastUserSend: msg.userGroup,
            createdAt: `${date.getHours()}:${date.getMinutes()} | ${date.getDate()}-${
                date.getMonth() + 1
            }-${date.getFullYear()}`,
        };
        await ContactsModel.updateRecent(message);
        return message;
    } catch (error) {
        console.log(error);
    }
};
const updateContactsGroup = async () => {};
export { addMessage, updateContactsGroup };
