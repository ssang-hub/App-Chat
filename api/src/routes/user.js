import express from 'express';
import * as userController from '@controllers/userController';
import * as messageController from '@controllers/messageController';
import * as authController from '@controllers/authController';
import * as groupController from '@controllers/groupController';
import { checkAvatarFile } from '@middlewares/accountMiddleware';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const storage = new multer.memoryStorage();
const upload = multer({
    storage,
});

const route = express.Router();

route.get('/getMessages', messageController.getMessages);
route.get('/getGroupMessages', messageController.getGroupMessages);

route.get('/myInfo', userController.getMyInfo);

route.get('/getContacts', userController.getContacts);

route.get('/getUserInfomation/:userId', userController.getUserInfomation);
route.get('/getAllFriend', userController.getAllFriend);

// group controller
route.post('/createGroup', groupController.createGroup);
route.get('/getUsersInGroup', groupController.getUsersInGroup);
route.get('/getAllCustomAvatarGroup', groupController.getCustomAvatarGroup);
route.post('/addUsersToGroup', groupController.addUsersToGroup);
route.post('/leaveGroup', groupController.leaveGroup);

route.post('/searchUser', userController.searchUser);
route.put(
    '/updateMyProfile',
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'coverAvatar', maxCount: 1 },
    ]),
    checkAvatarFile,
    userController.updateMyProfile,
);

route.post('/acceptRequest', userController.acceptRequest);
route.get('/friendRequest', userController.friendRequest);
route.get('/getNumberRequest', userController.getNumberRequest);
route.delete('/refuseRequest', userController.refuseRequest);

route.post('/refresh', authController.refreshToken);

export default route;
