import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getSubscription,
  unpublishWebsite,
  getBillingPlans,
  selectBillingPlan,
  validatePromotionCode,
  activateGiftSubscription,
  getPaymentMethods,
  getBillingHistory,
} from "../controllers/subscriptionController.js";

const router = express.Router();

router.get("/plans", getBillingPlans);

router.post("/promotions/validate", protect, validatePromotionCode);

router.get("/:businessId", protect, getSubscription);

router.get("/:businessId/payment-methods", protect, getPaymentMethods);

router.get("/:businessId/billing-history", protect, getBillingHistory);

router.post("/:businessId/select-plan", protect, selectBillingPlan);

router.post("/:businessId/unpublish", protect, unpublishWebsite);

router.post("/:businessId/activate-gift", protect, activateGiftSubscription);

// Not available until secure payment registration:
// POST /:businessId/start-trial
// POST /:businessId/checkout
// POST /:businessId/cancel

export default router;
