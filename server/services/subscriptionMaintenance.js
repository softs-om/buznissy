import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const expireSubscriptions = async () => {
  const now = new Date();

  const expiredTrials = await prisma.subscription.findMany({
    where: {
      status: "TRIALING",
      trialEndsAt: { lte: now },
    },
    select: { businessId: true },
  });

  for (const { businessId } of expiredTrials) {
    await prisma.$transaction([
      prisma.subscription.updateMany({
        where: {
          businessId,
          status: "TRIALING",
          trialEndsAt: { lte: now },
        },
        data: { status: "EXPIRED" },
      }),
      prisma.business.update({
        where: { id: businessId },
        data: {
          publicationStatus: "NOT_PUBLISHED",
          status: "DRAFT",
        },
      }),
    ]);
  }

  return expiredTrials.length;
};
