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
import {
  getCheckoutCapabilities,
  getPaymentMethods,
  getBillingHistory,
  cancelAtPeriodEnd,
  resumeRenewal,
  schedulePlanChange,
  clearScheduledPlanChange,
} from "../controllers/billingManagementController.js";
const router = express.Router();
router.get("/plans", getBillingPlans);
router.post("/promotions/validate", protect, validatePromotionCode);
router.get("/:businessId", protect, getSubscription);
router.get(
  "/:businessId/checkout-capabilities",
  protect,
  getCheckoutCapabilities,
);
router.get("/:businessId/payment-methods", protect, getPaymentMethods);
router.get("/:businessId/billing-history", protect, getBillingHistory);
router.post("/:businessId/select-plan", protect, selectBillingPlan);
router.post("/:businessId/cancel", protect, cancelAtPeriodEnd);
router.post("/:businessId/resume", protect, resumeRenewal);
router.post("/:businessId/schedule-plan", protect, schedulePlanChange);
router.post(
  "/:businessId/clear-scheduled-plan",
  protect,
  clearScheduledPlanChange,
);
router.post("/:businessId/unpublish", protect, unpublishWebsite);
router.post("/:businessId/activate-gift", protect, activateGiftSubscription);
// Do not add a live checkout/start-trial endpoint until verified provider integration.
export default router;
