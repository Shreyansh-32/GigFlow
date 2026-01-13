"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSocket = exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
const userSocketMap = new Map();
const initSocket = (httpServer) => {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: [
                "http://localhost:5173",
                "https://gig-flow-ruby.vercel.app"
            ],
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);
        const userId = socket.handshake.query.userId;
        if (userId && userId !== "undefined") {
            userSocketMap.set(userId, socket.id);
            console.log(`User registered: ${userId} -> ${socket.id}`);
            io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
        }
        socket.on('disconnect', () => {
            for (const [key, value] of userSocketMap.entries()) {
                if (value === socket.id) {
                    userSocketMap.delete(key);
                    break;
                }
            }
            io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
            console.log('Client disconnected:', socket.id);
        });
    });
    return io;
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
exports.getIO = getIO;
const getUserSocket = (userId) => {
    return userSocketMap.get(userId);
};
exports.getUserSocket = getUserSocket;
