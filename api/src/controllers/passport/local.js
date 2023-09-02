import { ExtractJwt, Strategy } from 'passport-jwt';
import dotenv from 'dotenv';
dotenv.config();

const jwtSrategy = new Strategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
        secretOrKey: process.env.JWT_SECRET_KEY,
    },
    (jwt_payloads, done) => {
        try {
            return done(null, jwt_payloads);
        } catch (error) {
            console.log('error: ' + error);
            done(error, false);
        }
    },
);
export default jwtSrategy;
