import express from 'express'
import { Server } from 'socket.io'
import http  from 'http'
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken'
const app = express();


const server = http.createServer(app)
const io = new Server(server,{
    cors :{
    origin: process.env.FRONTEND_URL,
    credentials: true
    }
})

const onlineUser = new Set()
io.on('connection', async(socket) => {
    console.log('Connect user', socket.id)

    const token = socket.handshake.auth?.token || socket.handshake.headers?.token;

    const decode = await jwt.verify(token,process.env.JWT_SECRET)

    const user = await User.findById(decode.id).select(" -password")

    //console.log('user from socket file:', user)
  
    //room
    socket.join(user?._id)
    onlineUser.add(user?._id)

    io.emit('onlineUser',Array.from(onlineUser))

    socket.on('disconnect',()=>{
        onlineUser.delete(user._id)
        console.log('disconnect user',socket.id)
    })
})

export {
    app,
    server,
}