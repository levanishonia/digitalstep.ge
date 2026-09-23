CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'INCOMPLETE', 'PAST_DUE', 'CANCELLED', 'EXPIRED');

ALTER TABLE "User"
ADD COLUMN "manualPlanOverride" "SubscriptionPlan",
ADD COLUMN "manualPlanOverrideExpiresAt" TIMESTAMP(3);

-- Existing paid plan assignments were administrator-managed. Preserve them as
-- explicit overrides rather than pretending they came from a payment provider.
UPDATE "User"
SET "manualPlanOverride" = "subscriptionPlan"
WHERE "subscriptionPlan" <> 'FREE';

CREATE TABLE "Subscription" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "plan" "SubscriptionPlan" NOT NULL,
  "status" "SubscriptionStatus" NOT NULL,
  "billingProvider" TEXT NOT NULL,
  "externalCustomerId" TEXT,
  "externalSubscriptionId" TEXT,
  "currentPeriodStart" TIMESTAMP(3),
  "currentPeriodEnd" TIMESTAMP(3),
  "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");
CREATE UNIQUE INDEX "Subscription_externalSubscriptionId_key" ON "Subscription"("externalSubscriptionId");
CREATE INDEX "Subscription_status_currentPeriodEnd_idx" ON "Subscription"("status", "currentPeriodEnd");
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
