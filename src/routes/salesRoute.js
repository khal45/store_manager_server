import "../middleware/authMiddleware.js";
import express from "express";
import bodyParser from "body-parser";
import {
  getAllSales,
  createSale,
  getSaleById,
} from "../controllers/salesController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const salesRouter = express.Router();

salesRouter.use(bodyParser.json());
salesRouter.use(bodyParser.urlencoded({ extended: true }));

salesRouter.get("/", verifyToken, isAdmin, getAllSales);
salesRouter.post("/", verifyToken, createSale);
salesRouter.get("/:saleId", verifyToken, getSaleById);

export default salesRouter;
