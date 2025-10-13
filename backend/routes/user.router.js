import Router from "express";
import {registerUser, loginUser, logoutUser} from "../controllers/userController.js";
import authMiddleware from "../middleware.js";
import { getUserDetails } from "../controllers/getUserdetails.js";
import multer from "multer";
const router = Router();

const storage = multer.memoryStorage();
const upload = multer({storage})

router.route('/register').post( upload.single("file"),registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(authMiddleware,logoutUser);
router.route('/user/me').get(authMiddleware, getUserDetails);

export default router;