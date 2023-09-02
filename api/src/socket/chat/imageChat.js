import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import * as messageService from '@services/messageService';
import {handleUpload} from "../../helpers/file";
dotenv.config();

const ImageChat = (socket) => {
    socket.on('send-image', async (data) => {
        try {
            const recieverUser = onlineUsers.get(data.to);
            const sender = onlineUsers.get(data.from);

            const buffer = Buffer.from(data.content, 'base64').toString('base64');
            const dataURI = "data:" + "image/png" + ";base64," + buffer;
            const {secure_url} = await handleUpload(dataURI)
            const { content, ...MessageData } = data;
            MessageData.message = { type: 'image', content: secure_url };
            const msg = await messageService.addMessage(MessageData);
            socket.to(sender).emit('send-image-success', MessageData);
            socket.to(recieverUser).emit('image-receive', MessageData);
        } catch (error) {
            console.log(error);
        }
    });
};

export default ImageChat;
