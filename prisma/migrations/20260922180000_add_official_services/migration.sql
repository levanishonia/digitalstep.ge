CREATE TYPE "ServiceStatus" AS ENUM ('ACTIVE', 'ARCHIVED');
CREATE TYPE "ServiceSource" AS ENUM ('DIGITAL_STEP', 'VERIFIED_PROVIDER');

ALTER TABLE "CatalogServiceOverride"
  ALTER COLUMN "status" DROP DEFAULT,
  ALTER COLUMN "status" TYPE "ServiceStatus" USING "status"::"ServiceStatus",
  ALTER COLUMN "status" SET DEFAULT 'ACTIVE',
  ADD COLUMN "isCustom" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "statusOnly" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "slug" TEXT,
  ADD COLUMN "serviceSource" "ServiceSource" NOT NULL DEFAULT 'DIGITAL_STEP';

ALTER TABLE "Order"
  ADD COLUMN "serviceSource" "ServiceSource" NOT NULL DEFAULT 'VERIFIED_PROVIDER';

UPDATE "Order"
SET "serviceSource" = 'DIGITAL_STEP'
WHERE "serviceId" IN ('seo-audit', 'process-automation', 'local-seo', 'ai-chat-workflow');

CREATE UNIQUE INDEX "CatalogServiceOverride_slug_key" ON "CatalogServiceOverride"("slug");

UPDATE "CatalogServiceOverride"
SET "serviceSource" = 'VERIFIED_PROVIDER'
WHERE "serviceId" IN (
  'social-management', 'business-website', 'brand-identity', 'ad-campaign',
  'promo-video', 'ai-content', 'content-strategy', 'email-marketing',
  'landing-page', 'ecommerce-ui', 'instagram-content', 'tiktok-plan',
  'google-ads', 'logo-animation', 'crm-automation', 'growth-consulting'
);
