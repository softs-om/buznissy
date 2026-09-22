/*
  Warnings:

  - You are about to drop the column `value` on the `ServiceAttribute` table. All the data in the column will be lost.
  - Added the required column `type` to the `ServiceAttribute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ServiceAttribute` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ServiceAttribute" DROP COLUMN "value",
ADD COLUMN     "maxValue" DOUBLE PRECISION,
ADD COLUMN     "minValue" DOUBLE PRECISION,
ADD COLUMN     "options" TEXT[],
ADD COLUMN     "placeholder" TEXT,
ADD COLUMN     "required" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
