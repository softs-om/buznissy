export const hasValidSubscription = (subscription, now = new Date()) => {
  if (!subscription) return false;

  if (subscription.status === "TRIALING") {
    return (
      subscription.trialEndsAt != null &&
      new Date(subscription.trialEndsAt) > now
    );
  }

  if (subscription.status === "ACTIVE") {
    return (
      subscription.currentPeriodEnd != null &&
      new Date(subscription.currentPeriodEnd) > now
    );
  }

  return false;
};
