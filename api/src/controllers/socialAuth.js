import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
import UserModel from '@models/userModel';
import * as authJWT from '@controllers/passport/JsonWebToken';

dotenv.config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleVerify = async (req, res, next) => {
    const { tokenId } = req.body;
    try {
        const { payload } = await client.verifyIdToken({ idToken: tokenId, audience: process.env.GOOGLE_CLIENT_ID });
        const checkUser = await UserModel.SocialLogin(payload);
        const { accessToken, refreshToken } = authJWT.createNewToken(checkUser);
        return res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        return res.status(408).json('request timeout');
    }
};

export { googleVerify };
