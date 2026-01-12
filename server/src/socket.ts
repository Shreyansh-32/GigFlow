import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server;
const userSocketMap = new Map<string, string>();

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log('New client connected:', socket.id);

    const userId = socket.handshake.query.userId as string;

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

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

export const getUserSocket = (userId: string) => {
  return userSocketMap.get(userId);
};