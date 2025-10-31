import { Router } from "express";
import authMiddleware from "../middleware.js";
import { getMessage, sendMessage } from "../controllers/messageController.js";

const router = Router();

router.route('/:conversationId').get(authMiddleware, sendMessage);
router.route('/').post(authMiddleware, getMessage);

export default router;