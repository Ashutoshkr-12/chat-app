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
    credentials: true
    }
})

const onlineUser = new Set();

io.on('connection', async(socket) => {
    console.log('Connect user', socket.id)

    // const token = socket.handshake.auth?.token || socket.handshake.headers?.token;

    // const decode = await jwt.verify(token,process.env.JWT_SECRET)

    // const user = await User.findById(decode.id).select(" -password")

    {/* console.log('user from socket file:', user)
  
    room
    socket.join(user?._id)
    onlineUser.add(user?._id.toString(),socket.id)

    io.emit('onlineUser',Array.from(onlineUser))

    socket.on('message-page',async(id) =>{
        console.log('userId', id)
        const userDetails = await User.findById(id).select('-password')
        
        const isOnline = onlineUser.has(id)
        const payload = {
            _id: userDetails?._id,
            name: userDetails?.name,
            email: userDetails?.email,
            profileImage: userDetails?.profileImage,
            online: isOnline,  // return true or false
        }
        //console.log(payload)

        socket.emit('message-user',payload)
    })
    socket.on('disconnect',()=>{
        onlineUser.delete(user._id)
        console.log('disconnect user',socket.id)
    }) */}

    //when user comes online
    socket.on('user-online',async(userId) =>  {
        onlineUser.set(userId, socket.id);
        await User.findByIdAndUpdate(userId,{online: true, socketId: socket.id});
        io.emit("online-users",Array.from(onlineUser.keys()));
    })

    //send messageRequest
    socket.on("send-request",async ({from, to}) => {
        try {
            const newReq = await MessageRequest.create({from,to});
            const receiverSocket = onlineUser.get(to);
            if(receiverSocket) io.to(receiverSocket).emit("receive-request",newReq);
        } catch (error) {
            console.error('Error in sending request from socket server:',error);
        }
    });

    //accept messageRequest
    socket.on("accept-request", async ({ requestId}) => {
        try {
            const request = await MessageRequest.findById(requestId).populate("from to");
            if(!request) return;

            request.status = "ACCEPTED";
            await request.save();

            //create conversation for both users
            const conversation = await Conversation.create({
                members: [request.from._id, request.to._id],
            });

            //get users to sidebar or just show notification
            const senderSocket = onlineUser.get(request.from._id.toString());
            const receiverSocket = onlineUser.get(request.to._id.toString());

            if(senderSocket) io.to(senderSocket).emit("request-accepted", conversation);
            if(receiverSocket) io.to(receiverSocket).emit("request-accepted",conversation);
        } catch (error) {
            console.error("Error in accepting request from socket server:",error);
        }
    });

    //if Request is rejected
    socket.on("reject-request", async({ requestId }) => {
        try {
            const request = await MessageRequest.findByIdAndUpdate(requestId,{ status: "REJECTED"})
            if(!request) return;

            const senderSocket = onlineUser.get(request.from.toString());
            if(senderSocket) io.to(senderSocket).emit("request-rejected",requestId);
                
        } catch (error) {

            console.error("Error in rejecting req from socket server:",error);
        }
    });


    //send message
    socket.on("send-message", async ({ conversationId, sender, text }) => {
        try {
            const message = await Message.create({ conversationId, sender, text })

            //conversation memberr
            const conversation  = await Conversation.findById(conversationId).populate("members");
            const receiverId = conversation.members.find((m)=> m._id.toString());

            //send message to receiver if online
            const receiverSocket = onlineUser.get(receiverId._id.toString());
            if(receiverSocket){
                io.to(receiverSocket).emit("receive-message",message);
            }

            //send ack to sender
            io.to(socket.id).emit("message-sent",message);
        } catch (error) {
            console.error("Error in sending message from socket server:",error);
        }
    });

    //user disconnect
    socket.on("disconnect", async ()=> {
        const userId = [...onlineUser.entries()].find(([id,sId]) => sId === socket.id?.[0]);
        if(userId){
            onlineUser.delete(userId);
            await User.findByIdAndUpdate(userId, { online: false, socketId: ""})
            io.emit("online-users", Array.from(onlineUser.keys()));
        }
        console.log("User dissconnected", socket.id);
    })

})

export {
    app,
    server,
}
