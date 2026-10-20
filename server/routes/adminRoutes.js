import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  overview,
  listMerchants,
  listPlans,
  updatePlan,
  listPromotions,
  createPromotion,
  setPromotionStatus,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/overview", overview);
router.get("/merchants", listMerchants);

router.get("/plans", listPlans);
router.patch("/plans/:planId", updatePlan);

router.get("/promotions", listPromotions);
router.post("/promotions", createPromotion);
router.patch("/promotions/:id/status", setPromotionStatus);

export default router;
