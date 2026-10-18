import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const expireSubscriptions = async () => {
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    // Lock subscriptions that have reached their end date.
    const expired = await tx.subscription.findMany({
      where: {
        OR: [
          {
            status: "TRIALING",
            trialEndsAt: { lte: now },
          },
          {
            status: "ACTIVE",
            currentPeriodEnd: { lte: now },
          },
        ],
      },
      select: {
        id: true,
        businessId: true,
        status: true,
        trialEndsAt: true,
        currentPeriodEnd: true,
      },
    });

    let count = 0;

    for (const item of expired) {
      const deadline =
        item.status === "TRIALING" ? item.trialEndsAt : item.currentPeriodEnd;

      const result = await tx.subscription.updateMany({
        where: {
          id: item.id,
          status: item.status,
          ...(item.status === "TRIALING"
            ? { trialEndsAt: { lte: now } }
            : { currentPeriodEnd: { lte: now } }),
        },
        data: {
          status: "EXPIRED",
          nextBillingAt: null,
        },
      });

      if (result.count === 0) continue;

      await tx.business.update({
        where: { id: item.businessId },
        data: {
          publicationStatus: "NOT_PUBLISHED",
          status: "DRAFT",
        },
      });

      count++;
    }

    return count;
  });
};
