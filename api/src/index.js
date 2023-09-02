import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import path from 'path';
import socketService from './socket';
import cors from 'cors';

import route from './routes';
import connectDB from '@config/Database';
import passport from '@controllers/passport';

const app = express();
const { Server } = require('socket.io');
const server = http.createServer(app);
dotenv.config();

const io = new Server(server, {
    cors: {
        origin: `${process.env.CLIENT_APP}`,
        credentials: true,
    },
});

connectDB();
app.use(cors({ origin: process.env.CLIENT_APP }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(path.resolve(), 'src/public')));

app.use(passport.initialize());
app.use(route);
global.onlineUsers = new Map();
socketService(io, global);

server.listen(process.env.PORT, () => {
    console.log('Server is running');
});
