-- AlterTable
ALTER TABLE "public"."Subscription" ADD COLUMN     "subscriptionPlanId" TEXT,
ADD COLUMN     "subscriptionPlanPriceId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_subscriptionPlanId_fkey" FOREIGN KEY ("subscriptionPlanId") REFERENCES "public"."SubscriptionPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_subscriptionPlanPriceId_fkey" FOREIGN KEY ("subscriptionPlanPriceId") REFERENCES "public"."SubscriptionPlanPrice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
