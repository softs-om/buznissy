-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'PAID');

-- CreateTable
CREATE TABLE "public"."Order" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "item" TEXT NOT NULL,
    "type" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'NEW',
    "payment" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "businessId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "public"."Order"("orderNumber");

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "public"."Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
