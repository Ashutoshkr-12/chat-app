import { Router } from "express";
import authMiddleware from "../middleware.js";
import { getConversation } from "../controllers/conversationController.js";


const router = Router();

router.route('/').get(authMiddleware,getConversation);

export default router;