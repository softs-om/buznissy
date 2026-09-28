-- AlterTable
ALTER TABLE "public"."Business" ADD COLUMN     "customLinks" JSONB,
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "googleMapsUrl" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "x" TEXT;
