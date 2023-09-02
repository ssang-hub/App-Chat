import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const notify = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, require: true },
        read: { type: Boolean },
    },
    { timestamps: true },
);
export default mongoose.model('notifies', notify);
