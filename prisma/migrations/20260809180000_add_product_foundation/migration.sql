CREATE TYPE "ProviderStatus" AS ENUM ('PENDING', 'VERIFIED', 'SUSPENDED');
CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'PRO', 'BUSINESS');
ALTER TABLE "User" ADD COLUMN "providerStatus" "ProviderStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN "subscriptionPlan" "SubscriptionPlan" NOT NULL DEFAULT 'FREE';
