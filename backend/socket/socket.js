import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import Conversation from '../models/conversation.model.js';
import MessageRequest from '../models/request.model.js';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

const userSocketMap = new Map(); 


io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Unauthorized: No token"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return next(new Error("User not found"));

    socket.userId = user._id.toString();
    userSocketMap.set(socket.userId, socket.id);

    await User.findByIdAndUpdate(socket.userId, {
      online: true,
      socketId: socket.id,
    });

    next();
  } catch (err) {
    console.error("Socket Auth Error:", err.message);
    next(new Error("Unauthorized"));
  }
});


io.on("connection", (socket) => {
  //console.log("Connected user:", socket.userId);

  // join all conversations the user is part of (optional)
  Conversation.find({ members: socket.userId })
    .then((convs) => {
      convs.forEach((conv) => socket.join(conv._id.toString()));
    })
    .catch(() => {});


 socket.on("message:send", async ({ conversationId, text }) => {
  if (!conversationId || !text) return;

  const message = await Message.create({
    conversationId,
    senderId: socket.userId,
    text,
  });

  const populatedMessage = await message.populate("senderId", "name profileImage");

  io.to(conversationId).emit("message:receive", populatedMessage);

  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: populatedMessage._id,
    updatedAt: new Date(),
  });
});


  socket.on("request:send", ({ from, to }) => {
    const receiverSocket = userSocketMap.get(to);
    if (receiverSocket) {
      io.to(receiverSocket).emit("request:received", { from });
    }
  });

 
  socket.on("request:accept", ({ from, to, conversation }) => {
    const senderSocket = userSocketMap.get(from);
    if (senderSocket) {
      io.to(senderSocket).emit("request:accepted", { to, conversation });
    }
  });

  socket.on("disconnect", async () => {
   // console.log(" User disconnected:", socket.userId);
    userSocketMap.delete(socket.userId);
    await User.findByIdAndUpdate(socket.userId, { online: false });
    io.emit("user:offline", socket.userId);
  });
});

export { app, server, io };
