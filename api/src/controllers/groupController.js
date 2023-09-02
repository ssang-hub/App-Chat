import dotenv from 'dotenv';
import groupModel from '@models/groupModel';
import ContactModel from '@models/ContactModel';
dotenv.config();

/**
 * @param req
 * @param res
 * @return {Promise<any>}
 * */
const createGroup = async (req, res) => {
    const groupData = {
        name: req.body.name,
        admin: { _id: req.user._id },
        groupUsers: [...req.body.groupUsers, { _id: req.user._id }],
    };
    const newGroup = req.body.avatar ? { ...groupData, avatar: req.body.avatar } : groupData;
    try {
        const groupCreate = await groupModel.createGroup(newGroup);
        const { __v, ...myGroup } = groupCreate.toJSON();
        // add contact
        const lastUserSend = { avatar: req.user.avatar, fullName: req.user.fullName };
        await ContactModel.createContactGroup(req.body.groupUsers, myGroup._id, lastUserSend);
        return res.status(200).json(myGroup);
    } catch (error) {
        return res.status(400).json('crete group failed');
    }
};

//  add one user to group
/**
 * @param req
 * @param res
 * @return {Promise<any>}
 * */
const addUsersToGroup = async (req, res) => {
    try {
        const result = await groupModel.addUser(group, user);
        if (result) {
            return res.status(200).json('Added users to group successfully');
        }
        return res.status(403).json('Add users to group failed');
    } catch (error) {
        return res.status(403).json('Add users to group failed');
    }
};

/**
 * @param req
 * @param res
 * @return {Promise<any>}
 * */
const leaveGroup = async (req, res) => {
    try {
        await groupModel.leaveGroup(req.user._id, req.body.groupId);
        return res.status(200).json('leave group successfully');
    } catch (error) {
        return res.status(403).json('not found');
    }
};

/**
 * @param req
 * @param res
 * @return {Promise<any>}
 * */
const getUsersInGroup = async (req, res) => {
    try {
        // const groupUsers = await groupModel.
    } catch (error) {
        return res.status(403).json('not found');
    }
};
/**
 * @param req
 * @param res
 * @return {Promise<any>}
 * */
const getCustomAvatarGroup = (req, res) => {
    const avatars = [];
    for (let i = 0; i < 12; i++) {
        avatars.push({ avatar: `${process.env.HOST}/images/groupAvatarDefault/${i}.png` });
    }
    return res.status(200).json(avatars);
};
export { getCustomAvatarGroup, addUsersToGroup, createGroup, leaveGroup, getUsersInGroup };
