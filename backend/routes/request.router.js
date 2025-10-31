import Router from 'express'
import authMiddleware from '../middleware.js';
import { acceptRequest, getRequest, rejectRequest, sendRequest } from '../controllers/requestController.js';

const router = Router();

router.route('/send').post(authMiddleware, sendRequest);
router.route('/received').get( authMiddleware, getRequest);
router.route('/accept/:requestId').post( authMiddleware, acceptRequest);
router.route('/reject/:requestId').post(authMiddleware,rejectRequest);

export default router;