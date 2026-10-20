
import prisma from "../lib/prisma.js";

const fail = (res, error) => {
  console.error("Admin error:", error);
  return res.status(500).json({
    message: "Unable to complete admin request",
  });
};

const money = (value) => Number(value ?? 0);

const planSelect = {
  id: true,
  name: true,
  description: true,
  billingInterval: true,
  commissionRate: true,
  trialMonths: true,
  isActive: true,
  prices: {
    orderBy: { version: "desc" },
    take: 1,
  },
};

export const overview = async (req, res) => {
  try {
    const [
      merchants,
      stores,
      publishedStores,
      activeSubscriptions,
      trials,
      transactions,
      recentBusinesses,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "OWNER" } }),
      prisma.business.count(),
      prisma.business.count({
        where: { publicationStatus: "PUBLISHED" },
      }),
      prisma.subscription.count({
        where: { status: "ACTIVE" },
      }),
      prisma.subscription.count({
        where: { status: "TRIALING" },
      }),
      prisma.billingTransaction.aggregate({
        where: { status: "SUCCEEDED" },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.business.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          slug: true,
          publicationStatus: true,
          createdAt: true,
        },
      }),
    ]);

    res.json({
      merchants,
      stores,
      publishedStores,
      activeSubscriptions,
      trials,
      collectedSubscriptionPayments: money(
        transactions._sum.amount
      ),
      successfulPayments: transactions._count,
      recentBusinesses,
    });
  } catch (error) {
    fail(res, error);
  }
};

export const listMerchants = async (req, res) => {
  try {
    const businesses = await prisma.business.findMany({
      take: 200,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        publicationStatus: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        subscription: {
          select: {
            status: true,
            trialEndsAt: true,
            currentPeriodEnd: true,
            plan: true,
          },
        },
      },
    });

    res.json({ businesses });
  } catch (error) {
    fail(res, error);
  }
};

export const listPlans = async (req, res) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      orderBy: { name: "asc" },
      select: planSelect,
    });

    res.json({
      plans: plans.map((p) => ({
        ...p,
        commissionRate: money(p.commissionRate),
        amount: money(p.prices[0]?.amount),
        priceId: p.prices[0]?.id ?? null,
        currency: p.prices[0]?.currency ?? "OMR",
      })),
    });
  } catch (error) {
    fail(res, error);
  }
};

export const updatePlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const { description, amount, isActive } = req.body;

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
      include: {
        prices: {
          orderBy: { version: "desc" },
          take: 1,
        },
      },
    });

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const data = {};

    if (description !== undefined) {
      if (
        typeof description !== "string" ||
        description.length > 1000
      ) {
        return res.status(400).json({
          message: "Invalid description",
        });
      }
      data.description = description.trim();
    }

    if (typeof isActive === "boolean") {
      data.isActive = isActive;
    }

    let price = null;

    if (amount !== undefined) {
      const parsed = Number(amount);

      if (
        !Number.isFinite(parsed) ||
        parsed <= 0 ||
        Math.round(parsed * 1000) !== parsed * 1000
      ) {
        return res.status(400).json({
          message: "Price must be a positive OMR amount with up to 3 decimals",
        });
      }

      price = parsed.toFixed(3);
    }

    await prisma.$transaction(async (tx) => {
      await tx.subscriptionPlan.update({
        where: { id: planId },
        data,
      });

      if (
        price !== null &&
        price !== plan.prices[0]?.amount?.toString()
      ) {
        await tx.subscriptionPlanPrice.create({
          data: {
            planId,
            amount: price,
            currency: "OMR",
            version: (plan.prices[0]?.version ?? 0) + 1,
          },
        });
      }
    });

    res.json({ message: "Plan updated" });
  } catch (error) {
    fail(res, error);
  }
};

export const listPromotions = async (req, res) => {
  try {
    const codes = await prisma.promotionCode.findMany({
      orderBy: { createdAt: "desc" },
    });

    const now = new Date();

    res.json({
      codes: codes.map((code) => ({
        ...code,
        value: code.value === null ? null : money(code.value),
        status: !code.active
          ? "DEACTIVATED"
          : code.expiresAt && code.expiresAt <= now
            ? "EXPIRED"
            : code.startsAt && code.startsAt > now
              ? "SCHEDULED"
              : "ACTIVE",
      })),
    });
  } catch (error) {
    fail(res, error);
  }
};

export const createPromotion = async (req, res) => {
  try {
    const {
      code,
      type,
      value,
      durationDays,
      expiresAt,
      maxRedemptions,
      perBusinessLimit,
      applicablePlan,
    } = req.body;

    const normalized = String(code ?? "")
      .trim()
      .toUpperCase();

    if (!/^[A-Z0-9_-]{3,40}$/.test(normalized)) {
      return res.status(400).json({
        message: "Code must contain 3–40 letters, numbers, _ or -",
      });
    }

    if (!["PERCENTAGE", "FREE_PERIOD"].includes(type)) {
      return res.status(400).json({
        message: "Unsupported promotion type",
      });
    }

    const percent = Number(value);
    const days = Number(durationDays);

    if (
      type === "PERCENTAGE" &&
      (!Number.isFinite(percent) || percent <= 0 || percent > 100)
    ) {
      return res.status(400).json({
        message: "Discount must be between 0 and 100%",
      });
    }

    if (
      type === "FREE_PERIOD" &&
      (!Number.isInteger(days) || days < 1 || days > 365)
    ) {
      return res.status(400).json({
        message: "Free period must be 1–365 days",
      });
    }

    if (
      !expiresAt ||
      !Number.isFinite(Date.parse(expiresAt)) ||
      new Date(expiresAt) <= new Date()
    ) {
      return res.status(400).json({
        message: "Choose a future expiry date",
      });
    }

    if (
      applicablePlan &&
      !["MONTHLY", "YEARLY"].includes(applicablePlan)
    ) {
      return res.status(400).json({
        message: "Invalid applicable plan",
      });
    }

    const totalLimit =
      maxRedemptions == null || maxRedemptions === ""
        ? null
        : Number(maxRedemptions);

    const businessLimit = Number(perBusinessLimit ?? 1);

    if (
      (totalLimit !== null &&
        (!Number.isInteger(totalLimit) || totalLimit < 1)) ||
      !Number.isInteger(businessLimit) ||
      businessLimit < 1
    ) {
      return res.status(400).json({
        message: "Invalid redemption limit",
      });
    }

    const created = await prisma.promotionCode.create({
      data: {
        code: normalized,
        type,
        value: type === "PERCENTAGE" ? percent : null,
        durationDays: type === "FREE_PERIOD" ? days : null,
        expiresAt: new Date(expiresAt),
        active: true,
        maxRedemptions: totalLimit,
        perBusinessLimit: businessLimit,
        applicablePlan: applicablePlan || null,
      },
    });

    res.status(201).json({
      message: "Promotion created",
      id: created.id,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Promotion code already exists",
      });
    }
    fail(res, error);
  }
};

export const setPromotionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { active, expiresAt } = req.body;

    if (typeof active !== "boolean") {
      return res.status(400).json({
        message: "active must be true or false",
      });
    }

    const current = await prisma.promotionCode.findUnique({
      where: { id },
    });

    if (!current) {
      return res.status(404).json({
        message: "Promotion not found",
      });
    }

    const data = { active };

    if (active) {
      const expiry = expiresAt
        ? new Date(expiresAt)
        : current.expiresAt;

      if (!expiry || expiry <= new Date()) {
        return res.status(400).json({
          message: "Reactivation requires a future expiry date",
        });
      }

      data.expiresAt = expiry;
    }

    await prisma.promotionCode.update({
      where: { id },
      data,
    });

    res.json({ message: "Promotion status updated" });
  } catch (error) {
    fail(res, error);
  }
};
