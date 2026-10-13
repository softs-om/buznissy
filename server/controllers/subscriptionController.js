import { PrismaClient } from "@prisma/client";
import { BILLING_PLANS } from "../config/billingPlans.js";

const prisma = new PrismaClient();

export const getSubscription = async (req, res) => {
  try {
    const business = await prisma.business.findFirst({
      where: {
        id: req.params.businessId,
        userId: req.user.userId,
      },
      include: { subscription: true },
    });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    return res.json({
      publicationStatus: business.publicationStatus,
      subscription: business.subscription,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Could not load subscription" });
  }
};

export const startTrial = async (req, res) => {
  try {
    const businessId = req.params.businessId;
    const userId = req.user.userId;

    const now = new Date();
    const trialEndsAt = new Date(now);
    trialEndsAt.setUTCMonth(trialEndsAt.getUTCMonth() + 1);

    const result = await prisma.$transaction(async (tx) => {
      const business = await tx.business.findFirst({
        where: { id: businessId, userId },
      });

      if (!business) {
        return { error: "Business not found", status: 404 };
      }

      // Atomically claim the trial, preventing duplicate activation.
      const claim = await tx.subscription.updateMany({
        where: {
          businessId,
          trialUsed: false,
          trialEligible: true,
          status: "NOT_STARTED",
        },
        data: {
          trialUsed: true,
          trialEligible: false,
          status: "TRIALING",
          trialStartedAt: now,
          trialEndsAt,
        },
      });

      if (claim.count !== 1) {
        return {
          error: "Trial unavailable or already started",
          status: 409,
        };
      }

      await tx.business.update({
        where: { id: businessId },
        data: {
          publicationStatus: "PUBLISHED",
          status: "PUBLISHED",
        },
      });

      const subscription = await tx.subscription.findUnique({
        where: { businessId },
      });

      return { subscription };
    });

    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }

    return res.json({
      message: "Trial started and website published",
      subscription: result.subscription,
    });
  } catch (error) {
    console.error("Trial activation failed:", error);
    return res.status(500).json({
      message: "Could not start trial",
    });
  }
};

export const unpublishWebsite = async (req, res) => {
  try {
    const result = await prisma.business.updateMany({
      where: {
        id: req.params.businessId,
        userId: req.user.userId,
      },
      data: {
        publicationStatus: "NOT_PUBLISHED",
        status: "DRAFT",
      },
    });

    if (result.count === 0) {
      return res.status(404).json({
        message: "Business not found",
      });
    }

    return res.json({
      message: "Website unpublished. Business data is preserved.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Could not unpublish website",
    });
  }
};

export const getBillingPlans = (req, res) => {
  return res.json({
    plans: BILLING_PLANS,
    trial: {
      duration: 1,
      unit: "calendar_month",
      eligibility: "once_per_business",
    },
  });
};

export const selectBillingPlan = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { plan } = req.body;

    if (!Object.hasOwn(BILLING_PLANS, plan)) {
      return res.status(400).json({ message: "Invalid billing plan" });
    }

    const business = await prisma.business.findFirst({
      where: { id: businessId, userId: req.user.userId },
      include: { subscription: true },
    });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    if (
      business.subscription &&
      !["NOT_STARTED", "EXPIRED", "CANCELED"].includes(
        business.subscription.status,
      )
    ) {
      return res.status(409).json({
        message: "This subscription cannot change plans in its current state",
      });
    }

    const subscription = await prisma.subscription.upsert({
      where: { businessId },
      create: {
        businessId,
        plan,
        status: "NOT_STARTED",
      },
      update: { plan },
    });

    return res.json({
      message: "Plan selected. No payment has been charged.",
      subscription,
      pricing: BILLING_PLANS[plan],
    });
  } catch (error) {
    console.error("Plan selection failed:", error);
    return res.status(500).json({ message: "Could not select plan" });
  }
};

export const validatePromotionCode = async (req, res) => {
  try {
    const { businessId, code, plan } = req.body;

    if (
      !businessId ||
      typeof code !== "string" ||
      !["MONTHLY", "YEARLY"].includes(plan)
    ) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const business = await prisma.business.findFirst({
      where: { id: businessId, userId: req.user.userId },
    });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const now = new Date();

    const promotion = await prisma.promotionCode.findUnique({
      where: { code: code.trim().toUpperCase() },
      include: {
        redemptions: {
          select: { businessId: true },
        },
      },
    });

    if (
      !promotion ||
      !promotion.active ||
      (promotion.startsAt && promotion.startsAt > now) ||
      (promotion.expiresAt && promotion.expiresAt <= now) ||
      (promotion.applicablePlan && promotion.applicablePlan !== plan)
    ) {
      return res.status(400).json({
        valid: false,
        message: "Invalid or expired promotional code",
      });
    }

    const usedByBusiness = promotion.redemptions.filter(
      (item) => item.businessId === businessId,
    ).length;

    if (
      usedByBusiness >= promotion.perBusinessLimit ||
      (promotion.maxRedemptions !== null &&
        promotion.redemptions.length >= promotion.maxRedemptions)
    ) {
      return res.status(400).json({
        valid: false,
        message: "Promotional code redemption limit reached",
      });
    }

    const originalBaisa = BILLING_PLANS[plan].amountBaisa;
    let discountBaisa = 0;

    if (promotion.type === "PERCENTAGE") {
      const percentage = Number(promotion.value);
      if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
        return res.status(400).json({ message: "Invalid promotion value" });
      }
      discountBaisa = Math.round((originalBaisa * percentage) / 100);
    } else if (promotion.type === "FIXED_AMOUNT") {
      const amount = Number(promotion.value);
      if (!Number.isFinite(amount) || amount < 0) {
        return res.status(400).json({ message: "Invalid promotion value" });
      }
      discountBaisa = Math.min(originalBaisa, Math.round(amount * 1000));
    }

    return res.json({
      valid: true,
      code: promotion.code,
      type: promotion.type,
      originalBaisa,
      discountBaisa,
      payableBaisa: originalBaisa - discountBaisa,
      durationDays: promotion.durationDays,
      message: "Code is valid. Discount will be applied at checkout.",
    });
  } catch (error) {
    console.error("Promotion validation failed:", error);
    return res.status(500).json({
      message: "Could not validate promotional code",
    });
  }
};
