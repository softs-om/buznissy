import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getSubscription,
  startTrial,
  unpublishWebsite,
  getBillingPlans,
  selectBillingPlan,
  validatePromotionCode,
} from "../controllers/subscriptionController.js";

const router = express.Router();
router.get("/plans", getBillingPlans);
router.get("/:businessId", protect, getSubscription);
router.post("/:businessId/start-trial", protect, startTrial);
router.post("/:businessId/unpublish", protect, unpublishWebsite);
router.post("/:businessId/select-plan", protect, selectBillingPlan);
router.post("/promotions/validate", protect, validatePromotionCode);
export default router;
