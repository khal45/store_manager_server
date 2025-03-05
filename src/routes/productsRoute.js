import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import {
  getProducts,
  addProduct,
  getProductById,
} from "../controllers/productsController.js";
import express from "express";
import bodyParser from "body-parser";

const productRouter = express.Router();

productRouter.use(bodyParser.json());
productRouter.use(bodyParser.urlencoded({ extended: true }));

productRouter.get("/", verifyToken, getProducts);
productRouter.post("/", verifyToken, isAdmin, addProduct);
productRouter.get("/:id", verifyToken, getProductById);

export default productRouter;
