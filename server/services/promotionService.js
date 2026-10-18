export const redeemPromotion = async (tx, { businessId, code, plan }) => {
  const normalizedCode = code.trim().toUpperCase();
  const now = new Date();

  const promotion = await tx.promotionCode.findUnique({
    where: { code: normalizedCode },
  });

  if (
    !promotion ||
    !promotion.active ||
    (promotion.startsAt && promotion.startsAt > now) ||
    (promotion.expiresAt && promotion.expiresAt <= now) ||
    (promotion.applicablePlan && promotion.applicablePlan !== plan)
  ) {
    throw new Error("Invalid or expired promotional code");
  }

  // Serialize competing redemptions for this code.
  await tx.$queryRaw`
    SELECT id FROM "PromotionCode"
    WHERE id = ${promotion.id}
    FOR UPDATE
  `;

  const totalUsed = await tx.promotionRedemption.count({
    where: { promotionCodeId: promotion.id },
  });

  const businessUsed = await tx.promotionRedemption.count({
    where: {
      promotionCodeId: promotion.id,
      businessId,
    },
  });

  if (
    businessUsed >= promotion.perBusinessLimit ||
    (promotion.maxRedemptions !== null && totalUsed >= promotion.maxRedemptions)
  ) {
    throw new Error("Promotional code redemption limit reached");
  }

  const redemption = await tx.promotionRedemption.create({
    data: {
      promotionCodeId: promotion.id,
      businessId,
    },
  });

  return { promotion, redemption };
};
