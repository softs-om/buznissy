import express from "express";
import * as serviceController from "../controllers/serviceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, serviceController.createService);

router.get("/category/:categoryId", protect, serviceController.getServices);

router.put("/:id", protect, serviceController.updateService);

router.delete("/:id", protect, serviceController.deleteService);

export default router;
