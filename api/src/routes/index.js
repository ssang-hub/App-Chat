import express from 'express';
import passport from '@controllers/passport';
import user from './user';
import authRoute from './auth';

const route = express.Router();

route.use(authRoute);
route.use(passport.authenticate('jwt', { session: false }), user);

export default route;
