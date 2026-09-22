import express from "express";
import * as categoryController from "../controllers/categoryController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", protect, categoryController.createCategory);

router.get("/business/:businessId", protect, categoryController.getCategories);
router.get("/:id", protect, getCategoryById);

router.put("/:id", protect, categoryController.updateCategory);

router.delete("/:id", protect, categoryController.deleteCategory);

export default router;
