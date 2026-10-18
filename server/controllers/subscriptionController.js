import { PrismaClient } from "@prisma/client";
import { BILLING_PLANS } from "../config/billingPlans.js";
import { redeemPromotion } from "../services/promotionService.js";
import { hasValidSubscription } from "../utils/subscriptionAccess.js";

const prisma = new PrismaClient();

export const getSubscription = async (req, res) => {
  try {
    const business = await prisma.business.findFirst({
      where: {
        id: req.params.businessId,
        userId: req.user.userId,
      },
      include: {
        subscription: {
          include: {
            subscriptionPlan: true,
            subscriptionPlanPrice: true,
          },
        },
      },
    });

    if (!business) {
      return res.status(404).json({
        message: "Business not found",
      });
    }

    const subscription = business.subscription;

    return res.json({
      publicationStatus: business.publicationStatus,
      subscription: subscription
        ? {
            ...subscription,
            subscriptionPlan: subscription.subscriptionPlan,
            subscriptionPlanPrice: subscription.subscriptionPlanPrice
              ? {
                  ...subscription.subscriptionPlanPrice,
                  amount: subscription.subscriptionPlanPrice.amount.toString(),
                }
              : null,
          }
        : null,
    });
  } catch (error) {
    console.error("Get subscription failed:", error);

    return res.status(500).json({
      message: "Could not load subscription",
    });
  }
};

export const startTrial = async (req, res) => {
  try {
    const businessId = req.params.businessId;
    const userId = req.user.userId;

    const now = new Date();
    const trialEndsAt = new Date(now);
    trialEndsAt.setUTCMonth(trialEndsAt.getUTCMonth() + 1);
    const selectedPlan = await prisma.subscription.findUnique({
      where: { businessId },
      select: { plan: true },
    });

    if (!selectedPlan?.plan) {
      return res.status(400).json({
        message: "Choose a subscription plan before starting your trial.",
      });
    }
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
          plan: {
            in: ["MONTHLY", "YEARLY"],
          },
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

export const getBillingPlans = async (req, res) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      include: {
        prices: {
          orderBy: { version: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const result = plans
      .filter((plan) => plan.prices.length > 0)
      .map((plan) => ({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        billingInterval: plan.billingInterval,
        commissionRate: Number(plan.commissionRate),
        trialMonths: plan.trialMonths,
        priceId: plan.prices[0].id,
        priceVersion: plan.prices[0].version,
        amount: plan.prices[0].amount.toString(),
        currency: plan.prices[0].currency,
      }));

    return res.json({
      plans: result,
    });
  } catch (error) {
    console.error("Get billing plans error:", error);
    return res.status(500).json({
      message: "Could not load subscription plans.",
    });
  }
};

export const selectBillingPlan = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { planId } = req.body;

    if (typeof planId !== "string" || !planId.trim()) {
      return res.status(400).json({
        message: "A valid subscription plan is required.",
      });
    }

    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        userId: req.user.userId,
      },
      include: {
        subscription: true,
      },
    });

    if (!business) {
      return res.status(404).json({
        message: "Business not found.",
      });
    }

    // Do not replace an ongoing subscription.
    if (
      business.subscription &&
      !["NOT_STARTED", "EXPIRED", "CANCELED"].includes(
        business.subscription.status,
      )
    ) {
      return res.status(409).json({
        message:
          "An existing subscription is still in progress. Plan changes must be scheduled for the next billing period.",
      });
    }

    const selectedPlan = await prisma.subscriptionPlan.findFirst({
      where: {
        id: planId.trim(),
        isActive: true,
      },
      include: {
        prices: {
          orderBy: {
            version: "desc",
          },
          take: 1,
        },
      },
    });

    if (!selectedPlan || selectedPlan.prices.length === 0) {
      return res.status(400).json({
        message: "This subscription plan is unavailable.",
      });
    }

    const selectedPrice = selectedPlan.prices[0];

    // Keep the legacy enum field synchronized with the newer plan tables.
    const planName = selectedPlan.name.trim().toUpperCase();

    if (!["MONTHLY", "YEARLY"].includes(planName)) {
      return res.status(400).json({
        message: "Unsupported subscription plan.",
      });
    }

    const subscription = await prisma.subscription.upsert({
      where: {
        businessId,
      },
      create: {
        businessId,
        plan: planName,
        subscriptionPlanId: selectedPlan.id,
        subscriptionPlanPriceId: selectedPrice.id,
        status: "NOT_STARTED",
      },
      update: {
        plan: planName,
        subscriptionPlanId: selectedPlan.id,
        subscriptionPlanPriceId: selectedPrice.id,
      },
    });

    return res.json({
      message: "Subscription plan saved. No payment has been charged.",
      subscription,
      pricing: {
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        priceId: selectedPrice.id,
        amount: selectedPrice.amount.toString(),
        currency: selectedPrice.currency,
        billingInterval: selectedPlan.billingInterval,
        commissionRate: Number(selectedPlan.commissionRate),
      },
    });
  } catch (error) {
    console.error("Plan selection failed:", error);

    return res.status(500).json({
      message: "Could not select subscription plan.",
    });
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

export const activateGiftSubscription = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { code } = req.body;

    if (typeof code !== "string" || !code.trim()) {
      return res.status(400).json({ message: "Gift code required" });
    }

    const result = await prisma.$transaction(async (tx) => {
      const business = await tx.business.findFirst({
        where: { id: businessId, userId: req.user.userId },
        include: { subscription: true },
      });

      if (!business) {
        throw new Error("Business not found");
      }

      if (
        business.subscription &&
        (hasValidSubscription(business.subscription) ||
          business.subscription.status === "PAUSED")
      ) {
        throw new Error("Business already has a subscription");
      }

      const plan = business.subscription?.plan;

      if (!plan) {
        throw new Error("Choose a billing plan first");
      }

      const { promotion } = await redeemPromotion(tx, {
        businessId,
        code,
        plan,
      });

      if (promotion.type !== "FREE_PERIOD") {
        throw new Error("This code is not a free subscription gift");
      }

      const days = promotion.durationDays;

      if (!Number.isInteger(days) || days <= 0 || days > 366) {
        throw new Error("Invalid gift duration");
      }

      const now = new Date();
      const endsAt = new Date(now.getTime() + days * 86400000);

      const subscription = await tx.subscription.update({
        where: { businessId },
        data: {
          status: "ACTIVE",
          currentPeriodStart: now,
          currentPeriodEnd: endsAt,
          nextBillingAt: endsAt,
        },
      });

      await tx.business.update({
        where: { id: businessId },
        data: {
          publicationStatus: "PUBLISHED",
          status: "PUBLISHED",
        },
      });

      return subscription;
    });

    return res.json({
      message: "Gift subscription activated and website published",
      subscription: result,
    });
  } catch (error) {
    console.error("Gift activation failed:", error);
    return res.status(400).json({
      message: error.message || "Could not activate gift",
    });
  }
};

export const getPaymentMethods = async (req, res) => {
  try {
    const business = await prisma.business.findFirst({
      where: {
        id: req.params.businessId,
        userId: req.user.userId,
      },
      select: { id: true },
    });

    if (!business) {
      return res.status(404).json({
        message: "Business not found.",
      });
    }

    const methods = await prisma.paymentMethod.findMany({
      where: { businessId: business.id },
      select: {
        id: true,
        brand: true,
        last4: true,
        expiryMonth: true,
        expiryYear: true,
        isDefault: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ paymentMethods: methods });
  } catch (error) {
    console.error("Payment methods error:", error);
    return res.status(500).json({
      message: "Could not load payment methods.",
    });
  }
};

export const getBillingHistory = async (req, res) => {
  try {
    const business = await prisma.business.findFirst({
      where: {
        id: req.params.businessId,
        userId: req.user.userId,
      },
      select: { id: true },
    });

    if (!business) {
      return res.status(404).json({
        message: "Business not found.",
      });
    }

    const transactions = await prisma.billingTransaction.findMany({
      where: { businessId: business.id },
      select: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return res.json({
      transactions: transactions.map((item) => ({
        ...item,
        amount: item.amount.toString(),
      })),
    });
  } catch (error) {
    console.error("Billing history error:", error);
    return res.status(500).json({
      message: "Could not load billing history.",
    });
  }
};
