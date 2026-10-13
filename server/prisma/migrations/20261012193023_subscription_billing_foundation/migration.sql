-- CreateEnum
CREATE TYPE "public"."DomainType" AS ENUM ('SUBDOMAIN', 'CUSTOM');

-- CreateEnum
CREATE TYPE "public"."DomainStatus" AS ENUM ('PENDING', 'VERIFYING', 'ACTIVE', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."BillingTransactionStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "public"."PromotionType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT', 'FREE_PERIOD', 'EXTRA_TRIAL', 'COMMISSION_DISCOUNT');

-- CreateEnum
CREATE TYPE "public"."BillingPlan" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('NOT_STARTED', 'TRIALING', 'ACTIVE', 'PAUSED', 'PAST_DUE', 'EXPIRED', 'CANCELED');

-- CreateEnum
CREATE TYPE "public"."PublicationStatus" AS ENUM ('NOT_PUBLISHED', 'PUBLISHED', 'PAUSED');

-- AlterTable
ALTER TABLE "public"."Business" ADD COLUMN     "publicationStatus" "public"."PublicationStatus" NOT NULL DEFAULT 'NOT_PUBLISHED';

-- CreateTable
CREATE TABLE "public"."Subscription" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "plan" "public"."BillingPlan",
    "status" "public"."SubscriptionStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "trialStartedAt" TIMESTAMP(3),
    "trialEndsAt" TIMESTAMP(3),
    "trialUsed" BOOLEAN NOT NULL DEFAULT false,
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "pausedAt" TIMESTAMP(3),
    "remainingSeconds" INTEGER,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "provider" TEXT,
    "providerCustomerId" TEXT,
    "providerSubscriptionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "trialEligible" BOOLEAN NOT NULL DEFAULT true,
    "pausedFromStatus" "public"."SubscriptionStatus",
    "nextBillingAt" TIMESTAMP(3),
    "providerPriceId" TEXT,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PaymentMethod" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerPaymentMethodId" TEXT NOT NULL,
    "brand" TEXT,
    "last4" TEXT,
    "expiryMonth" INTEGER,
    "expiryYear" INTEGER,
    "isDefault" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Domain" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "type" "public"."DomainType" NOT NULL,
    "status" "public"."DomainStatus" NOT NULL DEFAULT 'PENDING',
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BillingTransaction" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "amount" DECIMAL(12,3) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'OMR',
    "status" "public"."BillingTransactionStatus" NOT NULL DEFAULT 'PENDING',
    "provider" TEXT,
    "providerPaymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillingTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PromotionCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "public"."PromotionType" NOT NULL,
    "value" DECIMAL(12,3),
    "durationDays" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "startsAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "maxRedemptions" INTEGER,
    "perBusinessLimit" INTEGER NOT NULL DEFAULT 1,
    "applicablePlan" "public"."BillingPlan",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromotionCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PromotionRedemption" (
    "id" TEXT NOT NULL,
    "promotionCodeId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "redeemedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromotionRedemption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_businessId_key" ON "public"."Subscription"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_providerSubscriptionId_key" ON "public"."Subscription"("providerSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_providerPaymentMethodId_key" ON "public"."PaymentMethod"("providerPaymentMethodId");

-- CreateIndex
CREATE INDEX "PaymentMethod_businessId_idx" ON "public"."PaymentMethod"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "Domain_hostname_key" ON "public"."Domain"("hostname");

-- CreateIndex
CREATE INDEX "Domain_businessId_idx" ON "public"."Domain"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "BillingTransaction_providerPaymentId_key" ON "public"."BillingTransaction"("providerPaymentId");

-- CreateIndex
CREATE INDEX "BillingTransaction_businessId_idx" ON "public"."BillingTransaction"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "PromotionCode_code_key" ON "public"."PromotionCode"("code");

-- CreateIndex
CREATE INDEX "PromotionRedemption_businessId_idx" ON "public"."PromotionRedemption"("businessId");

-- CreateIndex
CREATE INDEX "PromotionRedemption_promotionCodeId_idx" ON "public"."PromotionRedemption"("promotionCodeId");

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "public"."Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentMethod" ADD CONSTRAINT "PaymentMethod_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "public"."Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Domain" ADD CONSTRAINT "Domain_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "public"."Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BillingTransaction" ADD CONSTRAINT "BillingTransaction_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "public"."Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BillingTransaction" ADD CONSTRAINT "BillingTransaction_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "public"."Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PromotionRedemption" ADD CONSTRAINT "PromotionRedemption_promotionCodeId_fkey" FOREIGN KEY ("promotionCodeId") REFERENCES "public"."PromotionCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PromotionRedemption" ADD CONSTRAINT "PromotionRedemption_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "public"."Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
