import nodemailer from 'nodemailer';
import fs from 'fs-extra';
import ejs from 'ejs';
import path from 'path';
import dotenv from 'dotenv'
import {handleUpload} from "../helpers/file";

dotenv.config();


const handleProcessFile = async(file) => {
    try {
        const b64 = Buffer.from(file.buffer).toString("base64");
        let dataURI = "data:" + file.mimetype + ";base64," + b64;
        const {secure_url} = await handleUpload(dataURI);
        return secure_url;
    } catch (error) {
        throw error
    }
}

export const checkAvatarFile = async (req, res, next) => {
    try {
        req.body = JSON.parse(JSON.stringify(req.body));
        if (req.files.avatar && checkImageFile(req.files.avatar[0])) {
            req.body = { ...req.body, avatar: await handleProcessFile(req.files.avatar[0])};
        }
        if (req.files.coverAvatar && checkImageFile(req.files.coverAvatar[0])) {
            req.body = { ...req.body, coverAvatar: await handleProcessFile(req.files.coverAvatar[0]) };
        }
        next();
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const checkImageFile = (file) => {
    if (file.mimetype.split('/')[0] !== 'image') {
        throw 'file type is not supported';
    }
    if (file.size > 1000000) {
        throw 'file is too large';
    }
    return true;
};

export const mailVerify = async (email, url) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAILADMIN,
                pass: process.env.PASSMAILADMIN,
            },
        });

        const template = ejs.compile(
            fs.readFileSync(path.join(path.resolve(), 'src/views/recoveryPassword.ejs'), 'utf-8'),
        );
        const html = template({ url: url });
        let message = {
            from: 'AppChat <chatappsang148@gmail.com>',
            to: `Recipient <${email}>`,
            subject: 'Khôi phục mật khẩu',
            text: 'Hello to myself!',

            html: html,
        };
        transporter.sendMail(message, (err, info) => {
            if (err) {
                return false;
            } else {
                console.log('sendding,...');

                console.log('Message sent: %s', info.response);
            }
        });
    } catch (error) {
        return false;
    }
};
