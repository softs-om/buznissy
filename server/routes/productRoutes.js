import express from "express";
import {
  createProduct,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createProduct);

router.get("/category/:categoryId", protect, getProductsByCategory);

router.put("/:productId", protect, updateProduct);

router.delete("/:productId", protect, deleteProduct);

export default router;
