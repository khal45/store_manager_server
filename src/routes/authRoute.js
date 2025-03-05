import { postLogin } from "../controllers/authController.js";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

const loginRouter = express.Router();

// middleware

loginRouter.use(bodyParser.json());
loginRouter.use(bodyParser.urlencoded({ extended: true }));

loginRouter.post("/", postLogin);
export default loginRouter;
