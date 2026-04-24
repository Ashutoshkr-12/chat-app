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
const PORT = process.env.PORT || 8000;;
// console.log(process.env.PORT);
// console.log(process.env.MONGODB_URI);
const allowedOrigins = [
 "https://chat-app-five-phi-84.vercel.app"
];

app.use(cors({
  origin: function(origin, callback){
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: "10mb"}))
app.use(express.urlencoded({extended: true , limit: "10mb"}))
app.use(cookieParser())

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// API ROUTES.......
app.use('/api/auth',userRoutes)
app.use('/api/request',requestRoutes)
app.use('/api/conversations',conversationRoutes)
app.use('/api/messages',messageRoutes)

 

export {app};