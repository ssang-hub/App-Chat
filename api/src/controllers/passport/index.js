import passport from 'passport';
import localStategy from './local';

passport.use(localStategy);

export default passport;
