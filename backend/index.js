import express from 'express';
import dotenv from "dotenv";
dotenv.config();
import cors from 'cors'
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.router.js';
import messageRoutes from './routes/message.router.js';
import requestRoutes from './routes/request.router.js';
import conversationRoutes from './routes/conversation.router.js';
import { app,server } from './socket/socket.js';


//const app = express();
const PORT = process.env.PORT;
// console.log(process.env.PORT);
// console.log(process.env.MONGODB_URI);

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(express.json({ limit: "10mb"}))
app.use(express.urlencoded({extended: true , limit: "10mb"}))
app.use(cookieParser())

connectDB().then(()=>{
    server.listen(PORT,()=>{
        console.log(`backend is running at PORT: http://localhost:${PORT}`)
    })
})


// API ROUTES.......
app.use('/api/auth',userRoutes)
app.use('/api/request',requestRoutes)
app.use('/api/conversations',conversationRoutes)
app.use('/api/messages',messageRoutes)

 

export {app};