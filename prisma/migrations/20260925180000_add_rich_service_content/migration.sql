CREATE TYPE "CatalogServiceType" AS ENUM ('ONE_TIME', 'MONTHLY', 'CONSULTATION');

ALTER TABLE "CatalogServiceOverride"
  ADD COLUMN "fullDescriptionKa" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "fullDescriptionEn" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "serviceType" "CatalogServiceType" NOT NULL DEFAULT 'ONE_TIME',
  ADD COLUMN "includedItems" JSONB,
  ADD COLUMN "processSteps" JSONB,
  ADD COLUMN "faqs" JSONB,
  ADD COLUMN "seoTitleKa" TEXT,
  ADD COLUMN "seoTitleEn" TEXT,
  ADD COLUMN "seoDescriptionKa" TEXT,
  ADD COLUMN "seoDescriptionEn" TEXT;
