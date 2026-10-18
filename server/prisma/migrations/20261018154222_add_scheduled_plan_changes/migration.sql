-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "pendingPlanId" TEXT,
ADD COLUMN     "pendingPlanPriceId" TEXT,
ADD COLUMN     "planChangeAt" TIMESTAMP(3);
