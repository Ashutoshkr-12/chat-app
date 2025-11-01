import { Router } from "express";
import authMiddleware from "../middleware.js";
import { getMessage, sendMessage } from "../controllers/messageController.js";

const router = Router();

router.route('/:conversationId').post(authMiddleware, sendMessage);
router.route('/:conversationId').get(authMiddleware, getMessage);

export default router;