ALTER TABLE "User" ADD COLUMN "providerSlug" TEXT;
ALTER TABLE "Order" ADD COLUMN "providerUserId" TEXT;

CREATE UNIQUE INDEX "User_providerSlug_key" ON "User"("providerSlug");
CREATE INDEX "Order_providerUserId_status_idx" ON "Order"("providerUserId", "status");

ALTER TABLE "Order" ADD CONSTRAINT "Order_providerUserId_fkey"
FOREIGN KEY ("providerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
