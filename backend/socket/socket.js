import express from 'express'
import { Server } from 'socket.io'
import http  from 'http'
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken'
import MessageRequest from '../models/request.model.js';
import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';



const app = express();

const server = http.createServer(app)
const io = new Server(server,{
    cors :{
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST"],
    },
})

const userSocketMap = new Map();

io.use(async ( socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if(!token) return next(new Error('Unauthorized'));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if(!user) return next(new Error("User not found"));

        socket.userId = user._id.toString();
        userSocketMap.set(user._id.toString(), socket.id);
        next();
    } catch (error) {
        next(new Error('Unauthorized'));
    }
});

//when user connects
io.on('connection', async(socket) => {
    console.log('Connect user', socket.userId)

   

    //when user comes online
    socket.on('user:online',async(userId) =>  {
        onlineUser.set(userId, socket.id);
        await User.findByIdAndUpdate(userId,{online: true, socketId: socket.id});
        io.emit("online-users",Array.from(onlineUser.keys()));
    })

    //send messageRequest
    socket.on("request:send",async ({from, to}) => {
        try {
            const receiverSocketId = userSocketMap.get(to);
            if(receiverSocketId) io.to(receiverSocketId).emit("request:received", { from });
        } catch (error) {
            console.error('Error in sending request from socket server:',error);
        }
    });

    //accept messageRequest
  socket.on("request:accept", ({ from, to, conversation }) => {
      const senderSocketId = userSocketMap.get(from);
      if (senderSocketId) {
        io.to(senderSocketId).emit("request:accepted", { to, conversation });
      }
    });

    // Conversation created
    socket.on("conversation:new", ({ conversation }) => {
      const participants = conversation.participants || [];
      participants.forEach((p) => {
        const sId = userSocketMap.get(p);
        if (sId) io.to(sId).emit("conversation:new", conversation);
      });
    });

    //if Request is rejected
  


    //send message
    socket.on("message:send", async ({ to, text }) => {
       const receiverSocketId = userSocketMap.get(to);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("message:receive", text);
      }
    });

    //user disconnect
  socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.userId);
      userSocketMap.delete(socket.userId);
      io.emit("user:offline", socket.userId);
    });
 
})

export {
    app,
    server,
}
