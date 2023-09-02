import express from 'express';

import * as authController from '@controllers/authController';
import { googleVerify } from '@controllers/socialAuth';

const route = express.Router();
route.post('/register', authController.register);
route.post('/login', authController.login);
route.post('/logout', authController.logout);
route.put('/changePassword', authController.changePassword);

route.post('/googleVerify', googleVerify);

route.post('/forgotPassword', authController.forgotPassword);
route.get('/checkURLReset', authController.checkURLReset, authController.URLIsChecked);
route.put('/resetPassword', authController.checkURLReset, authController.resetPassword);

export default route;
