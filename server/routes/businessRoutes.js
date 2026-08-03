import express from "express";
import {
  createBusiness,
  getMyBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness
} from "../controllers/businessController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", protect, upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
]), createBusiness);
router.get("/", protect, getMyBusinesses);
router.get("/:id", protect, getBusinessById);
router.put("/:id", protect, updateBusiness);
router.delete("/:id", protect, deleteBusiness);

export default router;
