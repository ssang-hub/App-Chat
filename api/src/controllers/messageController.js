import messageModel from '@models/messageModel';

/**
 * @param req
 * @param res
 * @return {Promise<any>}
 * */
const getMessages = async (req, res) => {
    try {
        const result = await messageModel.getMessages([req.query.u, req.user._id], req.query.p);

        const messages = result.map((item) => {
            const date = new Date(item.createdAt);
            return {
                from: item.senderId,
                to: item.receiverId,
                message: item.message,
                createdAt: `${date.getHours()}:${date.getMinutes()} | ${date.getDate()}-${
                    date.getMonth() + 1
                }-${date.getFullYear()}`,
            };
        });
        return res.status(200).json(messages.reverse());
    } catch (error) {
        return res.status(408).json('Request timeout');
    }
};

/**
 * @param req
 * @param res
 * @return {Promise<any>}
 * */
const getGroupMessages = async (req, res) => {
    try {
        const result = await messageModel.getGroupMessages(req.query.groupId, req.query.p);
        const messages = result.map((item) => {
            const date = new Date(item.createdAt);
            return {
                ...item,
                createdAt: `${date.getHours()}:${date.getMinutes()} | ${date.getDate()}-${
                    date.getMonth() + 1
                }-${date.getFullYear()}`,
            };
        });
        return res.status(200).json(messages.reverse());
    } catch (error) {
        return res.status(408).json('Request timeout');
    }
};

export { getMessages, getGroupMessages };
