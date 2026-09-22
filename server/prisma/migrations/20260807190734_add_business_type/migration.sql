-- CreateEnum
CREATE TYPE "public"."BusinessType" AS ENUM ('TRADER', 'ENTREPRENEUR', 'INFLUENCER');

-- AlterTable
ALTER TABLE "public"."Business" ADD COLUMN     "businessType" "public"."BusinessType",
ADD COLUMN     "industry" TEXT;
