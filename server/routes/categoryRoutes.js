import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createCategory);

router.get("/business/:businessId", protect, getCategories);

router.get("/:id", protect, getCategoryById);

router.put("/:id", protect, updateCategory);

router.delete("/:id", protect, deleteCategory);

export default router;
