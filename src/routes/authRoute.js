import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import verifyUserToken from "../controllers/authController.js";
const authRouter = express.Router();

authRouter.get("/", verifyToken, verifyUserToken);

export default authRouter;
