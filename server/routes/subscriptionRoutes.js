import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getSubscription,
  unpublishWebsite,
  getBillingPlans,
  selectBillingPlan,
  validatePromotionCode,
  activateGiftSubscription,
} from "../controllers/subscriptionController.js";

const router = express.Router();

router.get("/plans", getBillingPlans);

router.get("/:businessId", protect, getSubscription);

// Disabled until Thawani card registration is implemented.
// router.post("/:businessId/start-trial", protect, startTrial);

router.post("/:businessId/unpublish", protect, unpublishWebsite);

router.post("/:businessId/select-plan", protect, selectBillingPlan);

router.post("/promotions/validate", protect, validatePromotionCode);

router.post("/:businessId/activate-gift", protect, activateGiftSubscription);

export default router;
