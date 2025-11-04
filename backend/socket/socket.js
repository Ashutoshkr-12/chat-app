import express from 'express'
import http from 'http'
import { Server } from 'socket.io';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken'
import Message from '../models/message.model.js';



const app = express();

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    Credential: true,
    // methods: ['GET', 'POST'],
  }
})


const onlineUser = new Map();

io.on('connection',async (socket) => {
  //console.log('connect user:', socket.id)

  const token = socket.handshake.auth.token;
  if(!token) return socket.disconnect();

  const decode = await jwt.verify(token, process.env.JWT_SECRET)
  const user = await User.findById(decode.id);

  socket.userId = user._id.toString();
  onlineUser.set(socket.userId,socket.id);
   //console.log("user online:", user._id);
   io.emit("user-list", Array.from(onlineUser.keys()));

   socket.broadcast.emit("user-online", socket.userId);
   

  await User.findByIdAndUpdate(socket.userId, {
    online: true,
    socketId: socket.id,
  })

  socket.on("request-send", async ({ to , from}) => {
    const receiverSocket = onlineUser.get(to);

    if(receiverSocket){
      try {
        const sender = await User.findById(from).select('name email profileImage')
        io.to(receiverSocket).emit("request-receive", { from: {
          _id: sender._id,
          name: sender.name,
          profileImage: sender.profileImage,
          email: sender.email
        }});

      
      } catch (error) {
          console.error('Error sending request from socket server:', err.message);
      }
      //console.log(`requets send from ${from} to ${to}`)
    }
  });

  socket.on("request:accept", async ({ from, to, conversation }) => {
    const senderSocket = onlineUser.get(from);
    const receiverSocket = onlineUser.get(to);

    // send to both users to update conversation list
    if (senderSocket) io.to(senderSocket).emit("conversation:new", conversation);
    if (receiverSocket) io.to(receiverSocket).emit("conversation:new", conversation);
  });

  socket.on("join-conversation", ({ conversationId}) => {
    socket.join(conversationId);
    //console.log(`user ${socket.userId} joined ${conversationId}`)
  });

  socket.on("message-send", async ({ conversationId, senderId, receiverId, text}) => {
    const message = await Message.create({
      conversationId,
      sender: senderId,
      receiver: receiverId,
      text,
    });

    const populateMessage = await message.populate("sender", "name profileImage email")

    io.to(conversationId).emit("message-receive", populateMessage);

    // const receiverSocket = onlineUser.get(receiverId);
    // if(receiverSocket) io.to(receiverSocket).emit("message-receive",populateMessage);
  });

  socket.on("disconnect", async() => {
    await User.findByIdAndUpdate(socket.userId, {online: false});
    onlineUser.delete(socket.userId);
    socket.broadcast.emit("user-offline", socket.userId);
    io.emit("user-list", Array.from(onlineUser.keys()));
  });
});

export {app, server}