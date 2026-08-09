CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'CANCELLED');
CREATE TYPE "PaymentStatus" AS ENUM ('NOT_REQUIRED', 'PENDING', 'PAID', 'FAILED', 'REFUNDED');
CREATE TABLE "Order" (
 "id" TEXT NOT NULL, "orderNumber" TEXT NOT NULL, "customerId" TEXT NOT NULL,
 "serviceId" TEXT NOT NULL, "serviceSlug" TEXT NOT NULL, "serviceTitleKa" TEXT NOT NULL, "serviceTitleEn" TEXT NOT NULL,
 "providerSlug" TEXT NOT NULL, "providerName" TEXT NOT NULL, "packageId" TEXT NOT NULL, "packageNameKa" TEXT NOT NULL, "packageNameEn" TEXT NOT NULL,
 "priceMinor" INTEGER NOT NULL, "currency" TEXT NOT NULL DEFAULT 'GEL', "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
 "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING', "requirementsText" TEXT NOT NULL, "referenceLinks" JSONB,
 "deliveryDate" TIMESTAMP(3) NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");
CREATE INDEX "Order_customerId_createdAt_idx" ON "Order"("customerId", "createdAt");
CREATE INDEX "Order_customerId_status_idx" ON "Order"("customerId", "status");
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
