import userModel from '@models/userModel';
import friendRequestModel from '@models/friendRequestModel';
import ContactModel from '@models/ContactModel';
import groupModel from '@models/groupModel';

// Create new Group Chat

const formatDateString = (date) => {
    const DOB = new Date(date);
    return `${DOB.getDate()}-${DOB.getMonth() + 1}-${DOB.getFullYear()}`;
};

/**
 * @param req
 * @param res
 * @return {Promise<any>}
 * */
const getMyInfo = async (req, res) => {
    try {
        const result = await userModel.getMyInfo(req.user._id);
        const userData = { ...result.toJSON(), DOB: formatDateString(result.DOB) };
        return res.status(200).json({ ...userData, email: userData.local?.email });
    } catch (error) {
        return res.status(404).json('not_found');
    }
};
/**
 * @param req
 * @param res
 * @return {Promise<any>}
 * */
const getAllFriend = async (req, res) => {
    try {
        const result = await userModel.getAllFriend(req.user._id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(404).json('not_found');
    }
};
/**
 * @param req
 * @param res
 * @return {Promise<any>}
 * */
const searchUser = async (req, res) => {
    try {
        const resultSearchUser = await userModel.searchUsers(req.body.friend, req.user._id);
        const myRequest = await friendRequestModel.MyRequest(req.user._id);
        if (resultSearchUser) {
            const requestData = myRequest.map((item) => {
                return item.to.toString();
            });

            let responseData = [];

            for (let v of resultSearchUser) {
                if (v._id.toString() !== req.user._id.toString()) {
                    responseData.push({
                        _id: v._id,
                        fullName: v.fullName,
                        avatar: v.avatar,
                        pendingAccept: requestData.includes(v._id.toString()),
                    });
                }
            }

            res.status(200).json(responseData);
        }
    } catch (error) {
        res.status(404).json('Không tìm thấy người dùng');
    }
};

/**
 * @param req
 * @param res
 * @return {Promise<any>}
 * */
const updateMyProfile = async (req, res) => {
    try {
        const result = await userModel.findOneAndUpdate(
            { _id: req.user._id },
            { ...req.body, 'local.email': req.body.email },
            {
                new: true,
                projection: '_id fullName DOB gender phone address avatar coverAvatar',
            },
        );

        const newUSerData = { ...result.toJSON(), DOB: formatDateString(result.DOB), email: req.body.email };
        return res.status(200).json(newUSerData);
    } catch (error) {
        return res.status(400).json('bad_request');
    }
};
/**
 * @param req
 * @param res
 * @return {Promise<any>}
 * */
const getUserInfomation = async (req, res) => {
    try {
        const user = await userModel.getMyInfo(req.params.userId);
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
    }
};
/**
 * @param req
 * @param res
 * @return {Promise<any>}
 * */
const friendRequest = async (req, res) => {
    try {
        const requests = await friendRequestModel.getRequest(req.user._id);
        return res.status(200).json(requests);
    } catch (error) {
        console.log(error);
    }
};
/**
 * @param req
 * @param res
 * @return {Promise<any>}
 * */
const acceptRequest = async (req, res) => {
    try {
        /*
            delete Request and update friend list
        * */

        const userId = await friendRequestModel.findByIdAndDelete({ _id: req.body.id });
        await userModel.addFriend(userId.from, userId.to);
        await userModel.addFriend(userId.to, userId.from);

        res.status(200).json(true);
    } catch (error) {
        console.log(error);
    }
};
/**
 * @param req
 * @param res
 * @return {Promise<any>}
 * */
const refuseRequest = async (req, res) => {
    try {
        // console.log(req.body.id);
        await friendRequestModel.findOneAndDelete({ _id: req.body.id });
        res.status(200).json(true);
    } catch (error) {
        console.log(error);
    }
};
/**
 * @param req
 * @param res
 * @return {Promise<any>}
 * */
const getNumberRequest = async (req, res) => {
    try {
        res.status(200).json(await friendRequestModel.count({ to: req.user._id }));
    } catch (error) {
        console.log(error);
    }
};
/**
 * @param req
 * @param res
 * @return {Promise<any>}
 * */
const getContacts = async (req, res) => {
    try {
        const data = await ContactModel.getRecentContact(req.user._id);
        const userIds = data.map((item) => {
            if (item.from.toString() === req.user._id.toString()) {
                return item.to.toString();
            }
            return item.from.toString();
        });

        const groups = await groupModel.findGroupInArray(userIds);
        const { users, friends } = await userModel.findUsers(userIds, req.user._id);
        const usersData = users.map((user) => {
            const userDetail = user.toJSON();
            return {
                ...userDetail,
                isFriend: friends.some((friend) => friend.toString() === userDetail._id.toString()),
            };
        });
        const contacts = data.map((contact) => {
            const contactObject = {
                _id: contact._id,
                content: contact.content,
                updateAt: contact.updateAt,
                fromSelf: true,
            };
            // if recent messages from reqUser => return contact User
            if (
                contact.from.toString() === req.user._id.toString() &&
                usersData.some((user) => user._id.toString() === contact.to.toString())
            ) {
                contactObject.contact = usersData.find((user) => user._id.toString() === contact.to.toString());
            } else if (usersData.some((user) => user._id.toString() === contact.from.toString())) {
                contactObject.fromSelf = false;
                contactObject.contact = usersData.find((user) => user._id.toString() === contact.from.toString());
            } else {
                contactObject.users = contact.lastUserSend;
                contactObject.contact = groups.find((group) => group._id.toString() === contact.to.toString());
                // contactObject.userGroup =
            }
            return contactObject;
        });
        return res.status(200).json(contacts);
    } catch (error) {
        return res.status(408).json('Request timeout');
    }
};

export {
    refuseRequest,
    getAllFriend,
    getNumberRequest,
    getMyInfo,
    searchUser,
    updateMyProfile,
    getUserInfomation,
    friendRequest,
    acceptRequest,
    getContacts,
};
