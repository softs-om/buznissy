import express from "express";
import {
  createService,
  getServices,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createService);

router.get("/category/:categoryId", protect, getServices);

router.put("/:id", protect, updateService);

router.delete("/:id", protect, deleteService);

export default router;
