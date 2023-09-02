import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

/**
 * @param {object} data
 * @return {string}
 * */
const generateAccessToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET_KEY, {
        expiresIn: '1h',
    });
};

/**
 * @param {object} data
 * @return {string}
 * */
const generateRefreshToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET_KEY);
};

/**
 * @param {object} user
 * @return {object}
 * */
const createNewToken = (user) => {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return { accessToken, refreshToken };
};

export { generateRefreshToken, generateAccessToken, createNewToken };
