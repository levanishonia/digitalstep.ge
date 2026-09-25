ALTER TYPE "ServiceStatus" ADD VALUE IF NOT EXISTS 'DRAFT';
ALTER TYPE "ServiceStatus" ADD VALUE IF NOT EXISTS 'PENDING_REVIEW';

ALTER TABLE "CatalogServiceOverride"
  ADD COLUMN "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "isPopular" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "ServiceMedia" ADD COLUMN "isPrimary" BOOLEAN NOT NULL DEFAULT false;

CREATE UNIQUE INDEX "ServiceMedia_one_primary_per_service"
  ON "ServiceMedia"("serviceId") WHERE "isPrimary" = true;
