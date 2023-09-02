import mongoose from 'mongoose';
import groupModel from './groupModel';
const ObjectId = mongoose.Types.ObjectId;

const Schema = mongoose.Schema;

const MessageSchema = mongoose.Schema({
    senderId: { type: ObjectId },
    receiverId: { type: ObjectId },
    message: {
        type: { type: String, default: 'text' },
        content: String,
    },

    createdAt: { type: Date, default: Date.now },
    deleteAt: { type: Date, default: null },
});

MessageSchema.statics = {
    getMessages(users, pagenumber) {
        return this.find({ senderId: { $in: users }, receiverId: { $in: users } })
            .sort({ createdAt: -1 })
            .skip(pagenumber * 15)
            .limit(15);
    },
    async createMessage(data) {
        const result = await this.create({
            senderId: ObjectId(data.from),
            receiverId: ObjectId(data.to),
            message: data.message,
        });

        return result.toJSON();
    },
    getGroupMessages(groupId, pagenumber) {
        return this.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'senderId',
                    foreignField: '_id',
                    as: 'users',
                },
            },
            { $match: { receiverId: new ObjectId(groupId) } },
            { $sort: { createdAt: -1 } },
            { $limit: 15 },
            { $skip: pagenumber * 15 },
            { $unwind: '$users' },
            { $project: { 'users._id': 1, 'users.fullName': 1, 'users.avatar': 1, message: 1, createdAt: 1 } },
        ]);
    },
};
export default mongoose.model('messages', MessageSchema);
