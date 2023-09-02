import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const friendRequests = new Schema({
    from: { type: ObjectId, required: true },
    to: { type: ObjectId, required: true },
});
friendRequests.statics = {
    async createRequest(from, to) {
        try {
            return await this.create({ from: new ObjectId(from), to: new ObjectId(to) });
        } catch (error) {
            return error;
        }
    },
    getRequest(userId) {
        const Requests = this.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'from',
                    foreignField: '_id',
                    as: 'users',
                },
            },
            { $match: { to: new ObjectId(userId) } },
            { $unwind: '$users' },
            { $project: { 'users.fullName': 1, 'users.avatar': 1 } },
        ]);
        return Requests;
    },
    MyRequest(from) {
        return this.find({ from }, { _id: 0, from: 0, __v: 0 });
    },
};

export default mongoose.model('friendRequests', friendRequests);
