import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const refreshToken = new Schema({
    info: { type: String, required: true },
});
refreshToken.statics = {
    createRefreshToken(token) {
        return this.create({ info: token });
    },
    findRefreshToken(token) {
        return this.findOne({ info: token });
    },
    findAndDeleteRefreshToken(token) {
        return this.findOneAndDelete({ info: token }).exec();
    },
};
export default mongoose.model('refreshTokens', refreshToken);
