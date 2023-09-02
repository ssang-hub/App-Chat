import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;
import dotenv from 'dotenv';
dotenv.config();

const userSchema = new Schema({
    fullName: { type: String, required: true },
    local: {
        accountName: { type: String, trim: true, unique: true },
        hash: { type: String },
        email: { type: String, trim: true, default: null },
    },
    DOB: { type: Date, default: null },
    gender: { type: String, default: 'Nam' },
    phone: { type: String, default: null },
    address: { type: String, default: null },
    avatar: {
        type: String,
        default: `${process.env.HOST}/images/randomAvatar/${Math.round(Math.random() * 39)}.svg`,
    },
    coverAvatar: { type: String, default: `${process.env.HOST}/images/imageCover.png` },
    socialAuth: { type: String, default: '' },
    groups: [],
    friends: [{ type: ObjectId, default: null }],
});

userSchema.statics = {
    addFriend(Uid, friendId) {
        return this.updateOne({ _id: Uid }, { $push: { friends: friendId } });
    },

    async updatePassword(accountId, newPassword) {
        try {
            await this.updateOne({ _id: accountId }, { 'local.hash': bcrypt.hashSync(newPassword, 10) });
            return true;
        } catch (error) {
            return error;
        }
    },

    async checkPassword(accountId, password) {
        const account = await this.findOne({ _id: accountId });
        if (bcrypt.compareSync(password, account.local.hash)) {
            return true;
        } else {
            throw false;
        }
    },

    createAccount(accoutInfo) {
        // hash password and storage account to database
        accoutInfo.local.hash = bcrypt.hashSync(accoutInfo.local.hash, 10);
        return this.create(accoutInfo);
    },

    async login(accountInfo) {
        try {
            const account = await this.findOne(
                { 'local.accountName': accountInfo.accountName },
                { socialAuth: 0, friends: 0 },
            );
            if (bcrypt.compareSync(accountInfo.password, account.local.hash)) {
                const { local, ...userInfo } = account.toJSON();
                return { ...userInfo, email: local.email };
            } else {
                throw false;
            }
        } catch (error) {
            return error;
        }
    },

    async findFriend(fullName, friend) {
        try {
            const result = await this.findOne({ fullName: fullName, friends: { $in: [friend] } });
            if (result) return true;
            return false;
        } catch (error) {
            return error;
        }
    },

    findUserByName(fullName) {
        return this.findOne({ fullName: fullName });
    },

    async searchUsers(fullName, myAccountId) {
        try {
            const myAccount = await this.findOne({ _id: myAccountId }, { friends: 1 });
            const users = await this.find(
                { fullName: { $regex: '.*' + fullName + '.*', $options: 'i' }, _id: { $nin: myAccount.friends } },
                { local: 0, socialAuth: 0, friends: 0 },
            );
            return users;
            // console.log(users);
        } catch (error) {
            console.log(error);
        }
    },

    async getAllFriend(UserId) {
        try {
            const myAccount = await this.findOne({ _id: UserId }, { friends: 1 });
            const result = await this.find({ _id: { $in: myAccount.friends } }, { fullName: 1, avatar: 1 });
            return result;
        } catch (error) {
            console.log(error);
        }
    },
    async SocialLogin(payload) {
        try {
            const user = await this.findOneAndUpdate(
                { socialAuth: payload.sub },
                {
                    socialAuth: payload.sub,
                    fullName: payload.name,
                    avatar: payload.picture,
                },
                { upsert: true, returnOriginal: false },
            );
            const { local, socialAuth, friends, ...SocialUser } = user.toJSON();
            return SocialUser;
        } catch (error) {
            console.log(error);
        }
    },
    getMyInfo(userID) {
        return this.findOne(
            { _id: userID },
            { 'local.hash': 0, 'local.accountName': 0, socialAuth: 0, friends: 0, groups: 0 },
        );
    },

    async findUsers(userIds, myUserId) {
        try {
            const users = await this.find({ _id: { $in: userIds } }, { fullName: 1, avatar: 1 });
            const friends = await this.findOne({ _id: myUserId }, { friends: 1 });
            return { users, friends: friends.friends };
        } catch (error) {
            console.log(error);
        }
    },

    findUserByEmail(email) {
        return this.find({ 'local.email': email }, { id: 1 }).exec();
    },
};
export default mongoose.model('users', userSchema);
